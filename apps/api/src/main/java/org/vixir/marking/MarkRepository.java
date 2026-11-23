package org.vixir.marking;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarkRepository extends JpaRepository<Mark, UUID> {
    Optional<Mark> findBySubmissionId(UUID submissionId);
}
