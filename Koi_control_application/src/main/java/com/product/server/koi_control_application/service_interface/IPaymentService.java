package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.PaymentStatus;
import com.product.server.koi_control_application.pojo.response.PaymentInfomationResponse;

import java.time.LocalDateTime;
import java.util.List;


public interface IPaymentService {
    void createPaymentStatus(PaymentStatus paymentStatus);
    List<PaymentStatus> getAllPaymentStatus();

    List<PaymentInfomationResponse> getAllPaymentInfo();

    void updatePaymentStatus(int referenceId,String referenceName, String paymentStatus);
    void updatePaymentStatusFail(int referenceId, String referenceName,String paymentStatus, String description);
    void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate);

    String  getPaymentGatewayUrl(int referenceId, String referenceName);

    String getPaymentGatewayUrl(int referenceId, String referenceName, int userId);
}
