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
    public Payment createPaymentStatus(Payment paymentStatus) {
        return paymentRepository.save(paymentStatus);
    }

    @Override
    public List<Payment> getAllPaymentStatus() {
        return paymentRepository.findAll();
    }

    @Override
    public void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate) {
        paymentRepository.deleteByPaymentDateRange(fromDate, toDate);
    }

}
