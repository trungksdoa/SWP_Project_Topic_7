package com.product.server.koi_control_application.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor

public class PaymentInfomationResponse {
    private String email;
    private String address;
    private String phoneNumber;
    private String type;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String paymentDescription;

    public PaymentInfomationResponse(String email, String address, String phoneNumber, String type, String paymentStatus, String paymentMethod, LocalDateTime paymentDate, String paymentDescription) {
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.paymentStatus = paymentStatus;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.paymentDescription = paymentDescription;
    }
}
