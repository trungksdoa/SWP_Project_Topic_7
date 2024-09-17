package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByProductId(Integer productId);
    List<Feedback> findByUserId(Integer userId);
}