package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.UserLimit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLimitRepository extends JpaRepository<UserLimit, Integer> {
}