package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    @Modifying
    @Query("delete from payment_status p where p.paymentDate between ?1 and ?2")
    void deleteByPaymentDateRange(LocalDateTime fromDate, LocalDateTime toDate);
}