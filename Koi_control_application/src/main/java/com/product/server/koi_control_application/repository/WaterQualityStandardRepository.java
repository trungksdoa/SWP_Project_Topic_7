package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.WaterQualityStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface WaterQualityStandardRepository extends JpaRepository<WaterQualityStandard, Integer> {
    WaterQualityStandard findByPondId(int pondId);
}
