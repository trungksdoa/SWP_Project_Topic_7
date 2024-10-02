package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Payment;
import java.time.LocalDateTime;
import java.util.List;


public interface IPaymentService {
    void createPaymentStatus(Payment paymentStatus);
    List<Payment> getAllPaymentStatus();

    void updatePaymentStatus(int referenceId,String referenceName, String paymentStatus);
    void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate);
}
