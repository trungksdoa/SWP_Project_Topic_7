package com.product.server.koi_control_application.repository;


import com.product.server.koi_control_application.model.KoiGrowthHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
@Transactional
@RepositoryRestResource(exported = false)
public interface KoiGrowthHistoryRepository extends JpaRepository<KoiGrowthHistory, Integer> {
    Page<KoiGrowthHistory> findAllByKoiId(int koiId, Pageable pageable);

    @Query("select k from KoiGrowthHistory k where k.koiId = ?1")
    List<KoiGrowthHistory> findAllByKoi(int koiId);
}
