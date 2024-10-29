package com.product.server.koi_control_application.pojo.momo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MomoPaymentResponse {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private long amount;
    private long responseTime;
    private String message;
    private int resultCode;
    private String payUrl;
    private String shortLink;
}
