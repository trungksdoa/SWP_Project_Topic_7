package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.WaterParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface WaterParameterRepository extends JpaRepository<WaterParameter, Integer> {
    WaterParameter findByPondId(int pondId);
    boolean existsByPondId(int pondId);
}
