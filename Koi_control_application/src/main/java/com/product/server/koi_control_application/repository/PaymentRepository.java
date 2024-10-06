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
@Transactional
public interface PaymentRepository extends JpaRepository<PaymentStatus, Integer> {
    @Modifying
    @Query("delete from payment_status p where p.paymentDate between ?1 and ?2")
    void deleteByPaymentDateRange(LocalDateTime fromDate, LocalDateTime toDate);

    @Query("select p from payment_status p where p.referenceId = ?1 and p.referenceType = ?2")
    Optional<PaymentStatus> findByReferenceIdAndReferenceType(int referenceId, String referenceType);

    //SELECT p.full_name ,p.address, p.phone,IF(ps.reference_type = 'package', 'Package', 'Order') as Type,
    //       ps.payment_status,ps.payment_method,ps.payment_date,ps.payment_description
    //FROM payment_status ps
    //         LEFT JOIN orders p ON ps.reference_type = 'product' AND p.id = ps.reference_id
    //         LEFT JOIN packages pk ON ps.reference_type = 'package' AND pk.id = ps.reference_id;
    // Help me write the query for the above SQL statement
//    @Query(value="SELECT p.fullName, p.address, p.phone, " +
//            "CASE WHEN ps.referenceType = 'package' THEN 'Package' ELSE 'Order' END as Type, " +
//            "ps.paymentStatus, ps.paymentMethod, ps.paymentDate, ps.paymentDescription " +
//            "FROM payment_status ps " +
//            "LEFT JOIN Orders p ON ps.referenceType = 'product' AND p.id = CAST(ps.referenceId AS int) " +
//            "LEFT JOIN UserPackage pk ON ps.referenceType = 'package' AND pk.id = CAST(ps.referenceId AS int)")
//    List<PaymentInfomationResponse> getPaymentStatus();

    @Query("SELECT new com.product.server.koi_control_application.pojo.response." +
            "PaymentInfomationResponse(u.email, u.address, u.phoneNumber, " +
            "CASE WHEN ps.referenceType = 'package' THEN 'Package' ELSE 'Order' END, " +
            "ps.paymentStatus, ps.paymentMethod, ps.paymentDate, ps.paymentDescription)" +
            " FROM payment_status ps " +
            "LEFT JOIN Users u ON ps.userId = u.id " +
            "LEFT JOIN Orders p ON ps.referenceType = 'product' AND p.id = CAST(ps.referenceId AS int) " +
            "LEFT JOIN UserPackage pk ON ps.referenceType = 'package' AND pk.id = CAST(ps.referenceId AS int)")
    List<PaymentInfomationResponse> getPaymentStatus();
    //How to parse String to int in the query
    //SELECT * FROM payment_status WHERE reference_id = '1'

    //Type mismatch: number type is expected  ?

}

//
// ID     | referenceId | referenceType | paymentMethod | paymentDescription | paymentStatus | paymentDate
//   1      VIEW OrderCode| OrderCode| COD| null| PENDING| 2021-09-30 10:00:00