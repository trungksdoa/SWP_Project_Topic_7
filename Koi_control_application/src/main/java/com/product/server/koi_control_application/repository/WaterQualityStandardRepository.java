package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.WaterQualityStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
@RepositoryRestResource(exported = false)
public interface WaterQualityStandardRepository extends JpaRepository<WaterQualityStandard, Integer> {
    WaterQualityStandard findByPondId(int pondId);
}
