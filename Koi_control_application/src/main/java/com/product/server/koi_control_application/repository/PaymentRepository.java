package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.PaymentStatus;
import com.product.server.koi_control_application.pojo.response.PaymentInfomationResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface PaymentRepository extends JpaRepository<PaymentStatus, Integer> {
    @Modifying
    @Query("delete from payment_status p where p.paymentDate between ?1 and ?2")
    void deleteByPaymentDateRange(LocalDateTime fromDate, LocalDateTime toDate);

    @Query("select p from payment_status p where p.referenceId = ?1 and p.referenceType = ?2")
    Optional<PaymentStatus> findByReferenceIdAndReferenceType(int referenceId, String referenceType);


    @Query("SELECT new com.product.server.koi_control_application.pojo.response." +
            "PaymentInfomationResponse(u.email, u.address, u.phoneNumber, " +
            "CASE WHEN ps.referenceType = 'package' THEN 'Package' ELSE 'Order' END, " +
            "ps.paymentStatus, ps.paymentMethod, ps.paymentDate, ps.paymentDescription)" +
            " FROM payment_status ps " +
            "LEFT JOIN Users u ON ps.userId = u.id " +
            "LEFT JOIN Orders p ON ps.referenceType = 'product' AND p.id = CAST(ps.referenceId AS int) " +
            "LEFT JOIN UserPackage pk ON ps.referenceType = 'package' AND pk.id = CAST(ps.referenceId AS int)")
    List<PaymentInfomationResponse> getPaymentStatus();

    @Query("select p from payment_status p where p.referenceId = ?1 and p.referenceType = ?2 and p.userId = ?3")
    Optional<PaymentStatus> findByReferenceIdAndReferenceTypeAndUserId(int referenceId, String referenceType, int userId);


}

//
// ID     | referenceId | referenceType | paymentMethod | paymentDescription | paymentStatus | paymentDate
//   1      VIEW OrderCode| OrderCode| COD| null| PENDING| 2021-09-30 10:00:00