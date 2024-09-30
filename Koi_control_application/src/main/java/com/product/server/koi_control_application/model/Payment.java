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
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int referenceId; // Có thể là orderId hoặc packageId
    private String referenceType; // "ORDER" hoặc "PACKAGE"
    private String paymentMethod;
    private String paymentDescription;
    private String paymentStatus;
    private String paymentType;

    private LocalDateTime paymentDate;

    @PrePersist
    public void prePersist() {
        this.paymentDate = LocalDateTime.now();
    }

}
