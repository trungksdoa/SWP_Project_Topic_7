package com.product.server.koi_control_application.repository;


import com.product.server.koi_control_application.model.KoiGrowthHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
public interface KoiGrowthHistoryRepository extends JpaRepository<KoiGrowthHistory, Integer> {
    KoiGrowthHistory findByKoiId(int koiId);
}
