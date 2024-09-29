package com.product.server.koi_control_application.pojo.momo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class MomoRefundRequest {
    private String partnerCode;
    private String orderId;
    private String requestId;
    private Long amount;
    private Long transId;
    private String description;
    private String lang;
    private String signature;


}
