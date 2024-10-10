package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.PaymentStatus;
import com.product.server.koi_control_application.pojo.response.PaymentInfomationResponse;
import com.product.server.koi_control_application.repository.PaymentRepository;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {
    private final PaymentRepository paymentRepository;

    @Override
    public void createPaymentStatus(PaymentStatus paymentStatus) {
        paymentRepository.save(paymentStatus);
    }

    @Override
    public List<PaymentStatus> getAllPaymentStatus() {
        return paymentRepository.findAll();
    }

    @Override
    public List<PaymentInfomationResponse> getAllPaymentInfo() {
        return paymentRepository.getPaymentStatus();
    }

    @Override
    public void updatePaymentStatus(int referenceId, String referenceName, String paymentStatus) {
        PaymentStatus payment = getPaymentStatus(referenceId, referenceName);
        payment.setPaymentStatus(paymentStatus);
        paymentRepository.save(payment);
    }

    @Override
    public void updatePaymentStatusFail(int referenceId, String referenceName, String paymentStatus, String description) {
        PaymentStatus payment = getPaymentStatus(referenceId, referenceName);
        payment.setPaymentDescription(description);
        payment.setPaymentStatus(paymentStatus);
        paymentRepository.save(payment);
    }

    @Override
    public void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate) {
        paymentRepository.deleteByPaymentDateRange(fromDate, toDate);
    }

    @Override
    public String getPaymentGatewayUrl(int referenceId, String referenceName, int userId) {
        PaymentStatus payment = getPaymentStatus(referenceId, referenceName,userId);
        return payment.getPaymentGatewayUrl();
    }

    private PaymentStatus getPaymentStatus(int referenceId, String referenceName, int userId) {
        return paymentRepository.findByReferenceIdAndReferenceTypeAndUserId(referenceId, referenceName, userId).orElseThrow(() -> new RuntimeException("PaymentStatus not found"));
    }

    private PaymentStatus getPaymentStatus(int referenceId, String referenceName) {
        return paymentRepository.findByReferenceIdAndReferenceType(referenceId, referenceName).orElseThrow(() -> new RuntimeException("PaymentStatus not found"));
    }

}
