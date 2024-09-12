package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Pond;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PondRepository extends JpaRepository<Pond, Integer> {

}
