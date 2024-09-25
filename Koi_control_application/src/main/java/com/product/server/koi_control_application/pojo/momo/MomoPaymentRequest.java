package com.product.server.koi_control_application.pojo.momo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoPaymentRequest {
    private String orderInfo;
    private String amount;
    private String orderId;
    private String requestId;
    private List<MomoProduct> momoProducts;
    private MomoUserInfo momoUserInfo;
}