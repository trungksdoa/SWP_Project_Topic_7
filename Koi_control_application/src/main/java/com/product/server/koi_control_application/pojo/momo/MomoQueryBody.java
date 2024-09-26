package com.product.server.koi_control_application.pojo.momo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MomoQueryBody {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private String signature;
    private String lang;
}