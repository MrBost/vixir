package org.vixir.marking;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MarkCriterionRepository extends JpaRepository<MarkCriterion, MarkCriterion.MarkCriterionId> {
    // markId lives inside the embedded primary key, so a derived query name can't resolve it.
    @Query("select c from MarkCriterion c where c.id.markId = :markId")
    List<MarkCriterion> findByMarkId(@Param("markId") UUID markId);
}
