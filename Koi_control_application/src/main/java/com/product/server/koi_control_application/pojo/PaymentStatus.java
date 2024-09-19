package com.product.server.koi_control_application.pojo;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatus {
    private String status;
    private String message;
    private String amount;
    private String orderInfo;
    private String responseCode;
    private Long transactionNo;
    private String bankCode;
    private String payDate;
}
