package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    List<Feedback> findByProduct_Id(int id);

    List<Feedback> findByUser_Id(int id);
}