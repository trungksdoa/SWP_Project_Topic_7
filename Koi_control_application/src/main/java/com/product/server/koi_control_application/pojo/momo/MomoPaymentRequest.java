package com.product.server.koi_control_application.pojo.momo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoPaymentRequest {
    private String userId;
    private String orderInfo;
    private Long amount;
    private String orderId;
    private String requestId;
    private String orderType;
    private List<MomoProduct> momoProducts;
    private MomoUserInfo momoUserInfo;
}