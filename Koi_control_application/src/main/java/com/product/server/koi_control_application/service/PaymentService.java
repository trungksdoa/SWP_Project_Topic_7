package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Payment;
import com.product.server.koi_control_application.repository.PaymentRepository;
import com.product.server.koi_control_application.service_interface.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {
    private final PaymentRepository paymentRepository;

    @Override
    public void createPaymentStatus(Payment paymentStatus) {
        paymentRepository.save(paymentStatus);
    }

    @Override
    public List<Payment> getAllPaymentStatus() {
        return paymentRepository.findAll();
    }

    @Override
    public void updatePaymentStatus(int referenceId, String referenceName, String paymentStatus) {
        Payment payment = paymentRepository.findByReferenceIdAndReferenceType(referenceId, referenceName).orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentStatus(paymentStatus);
        paymentRepository.save(payment);
    }

    @Override
    public void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate) {
        paymentRepository.deleteByPaymentDateRange(fromDate, toDate);
    }

}
