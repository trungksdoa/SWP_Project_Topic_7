package com.product.server.koi_control_application.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "payment_status")
@Builder
public class PaymentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String referenceId; // Có thể là orderId hoặc packageId
    private String referenceType; // "OrderCode" hoặc "PACKAGE"
    private String paymentMethod;
    private String paymentDescription;
    private String paymentStatus;

    private String paymentGatewayUrl;
    private int userId;

    private LocalDateTime paymentDate;

    private LocalDateTime updatedDate;

    @PrePersist
    public void prePersist() {
        this.paymentDate = LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

}
