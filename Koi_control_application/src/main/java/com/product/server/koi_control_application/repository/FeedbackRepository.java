package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Feedback;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    List<Feedback> findByProduct_Id(int id);

    List<Feedback> findByUser_Id(int id);

    @Query("select f from Feedback f where f.orderId = ?1")
    Optional<Feedback> findByOrderId(int orderId);
}