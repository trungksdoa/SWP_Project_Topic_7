package com.product.server.koi_control_application.pojo;


import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatus {
    private String status;
    private String message;
    private String orderInfo;
    private String responseCode;

    @Column(name = "payDate", updatable = false)
    private LocalDateTime payDate;

    @PrePersist
    protected void onCreate() {
        payDate = LocalDateTime.now();
    }
}
