package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.KoiFish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KoiFishRepository extends JpaRepository<KoiFish, Integer> {
    boolean existsByName(String name);
}
