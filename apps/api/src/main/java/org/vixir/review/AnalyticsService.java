package org.vixir.review;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.vixir.assignment.Assignment;
import org.vixir.attempt.AttemptRepository;
import org.vixir.marking.Mark;
import org.vixir.marking.MarkCriterion;
import org.vixir.marking.MarkCriterionRepository;
import org.vixir.marking.MarkRepository;
import org.vixir.school.EnrolmentRepository;
import org.vixir.submission.Submission;
import org.vixir.submission.SubmissionRepository;

/**
 * Class-wide results, histogram and common mistakes (Req 12.1–12.2).
 */
@Service
public class AnalyticsService {

    private final AttemptRepository attemptRepo;
    private final SubmissionRepository submissionRepo;
    private final MarkRepository markRepo;
    private final MarkCriterionRepository criterionRepo;
    private final ReviewFlagRepository flagRepo;
    private final EnrolmentRepository enrolmentRepo;

    public AnalyticsService(AttemptRepository attemptRepo,
                             SubmissionRepository submissionRepo,
                             MarkRepository markRepo,
                             MarkCriterionRepository criterionRepo,
                             ReviewFlagRepository flagRepo,
                             EnrolmentRepository enrolmentRepo) {
        this.attemptRepo = attemptRepo;
        this.submissionRepo = submissionRepo;
        this.markRepo = markRepo;
        this.criterionRepo = criterionRepo;
        this.flagRepo = flagRepo;
        this.enrolmentRepo = enrolmentRepo;
    }

    public record AssignmentResults(
            long enrolledCount,
            long submittedCount,
            List<StudentStatus> perStudent,
            int[] histogram,          // 5 equal buckets 0..max
            Map<String, Double> criterionAverages,
            long openFlagCount
    ) {}

    public record StudentStatus(UUID userId, String state, Integer total) {}

    /**
     * Results for one assignment. Takes the Assignment itself (callers already load it for the ownership
     * check) so the class used for enrolledCount always matches the assignment.
     */
    public AssignmentResults resultsForAssignment(Assignment assignment) {
        UUID assignmentId = assignment.getId();
        long enrolled = enrolmentRepo.countStudents(assignment.getClassId());

        List<UUID> attemptUserIds = attemptRepo.findByAssignmentId(assignmentId).stream()
                .map(a -> a.getUserId()).filter(Objects::nonNull).distinct().toList();

        List<StudentStatus> statuses = new ArrayList<>();
        List<Integer> scores = new ArrayList<>();

        for (UUID uid : attemptUserIds) {
            var attempt = attemptRepo.findByAssignmentIdAndUserIdAndState(assignmentId, uid, "RELEASED")
                    .or(() -> attemptRepo.findByAssignmentIdAndUserIdAndState(assignmentId, uid, "MARKED"))
                    .or(() -> attemptRepo.findByAssignmentIdAndUserIdAndState(assignmentId, uid, "SUBMITTED"))
                    .or(() -> attemptRepo.findByAssignmentIdAndUserIdAndState(assignmentId, uid, "IN_PROGRESS"))
                    .orElse(null);
            if (attempt == null) continue;

            Integer total = submissionRepo.findByAttemptId(attempt.getId())
                    .flatMap(s -> markRepo.findBySubmissionId(s.getId()))
                    .map(Mark::getTotal).orElse(null);

            if (total != null) scores.add(total);
            statuses.add(new StudentStatus(uid, attempt.getState(), total));
        }

        int[] histogram = buildHistogram(scores);
        Map<String, Double> criterionAvgs = criterionAverages(assignmentId);
        long openFlags = flagRepo.findOpenFlagsForAssignment(assignmentId).size();

        return new AssignmentResults(enrolled, scores.size(), statuses, histogram, criterionAvgs, openFlags);
    }

    public record CommonMistake(String criterionKey, String reason, double share) {}

    public List<CommonMistake> commonMistakes(UUID assignmentId) {
        // Collect all mark_criterion rows where awarded < max
        List<Submission> submissions = submissionRepo.findAll().stream()
                .filter(s -> {
                    var a = attemptRepo.findById(s.getAttemptId()).orElse(null);
                    return a != null && assignmentId.equals(a.getAssignmentId());
                }).toList();

        if (submissions.isEmpty()) return List.of();

        Map<String, List<String>> lostByKey = new HashMap<>();
        for (Submission s : submissions) {
            markRepo.findBySubmissionId(s.getId()).ifPresent(mark -> {
                criterionRepo.findByMarkId(mark.getId()).stream()
                        .filter(c -> c.getAwarded() < c.getMax())
                        .forEach(c -> lostByKey
                                .computeIfAbsent(c.getCriterionKey(), k -> new ArrayList<>())
                                .add(c.getReason()));
            });
        }

        double total = submissions.size();
        return lostByKey.entrySet().stream()
                .sorted(Comparator.comparingInt((Map.Entry<String, List<String>> e) -> e.getValue().size()).reversed())
                .limit(5)
                .map(e -> {
                    // Most common reason
                    String topReason = e.getValue().stream()
                            .collect(Collectors.groupingBy(r -> r, Collectors.counting()))
                            .entrySet().stream()
                            .max(Map.Entry.comparingByValue())
                            .map(Map.Entry::getKey).orElse("");
                    return new CommonMistake(e.getKey(), topReason, e.getValue().size() / total);
                })
                .toList();
    }

    // ---- helpers ----

    private int[] buildHistogram(List<Integer> scores) {
        int[] h = new int[5];
        if (scores.isEmpty()) return h;
        int maxScore = scores.stream().mapToInt(Integer::intValue).max().orElse(100);
        if (maxScore == 0) return h;
        for (int s : scores) {
            int bucket = Math.min(4, (int) (5.0 * s / (maxScore + 1)));
            h[bucket]++;
        }
        return h;
    }

    private Map<String, Double> criterionAverages(UUID assignmentId) {
        Map<String, List<Integer>> byKey = new HashMap<>();
        submissionRepo.findAll().stream()
                .filter(s -> {
                    var a = attemptRepo.findById(s.getAttemptId()).orElse(null);
                    return a != null && assignmentId.equals(a.getAssignmentId());
                })
                .forEach(s -> markRepo.findBySubmissionId(s.getId()).ifPresent(mark ->
                        criterionRepo.findByMarkId(mark.getId()).forEach(c ->
                                byKey.computeIfAbsent(c.getCriterionKey(), k -> new ArrayList<>())
                                        .add(c.getAwarded()))));
        Map<String, Double> avgs = new LinkedHashMap<>();
        byKey.forEach((k, v) -> avgs.put(k, v.stream().mapToInt(i -> i).average().orElse(0)));
        return avgs;
    }
}
