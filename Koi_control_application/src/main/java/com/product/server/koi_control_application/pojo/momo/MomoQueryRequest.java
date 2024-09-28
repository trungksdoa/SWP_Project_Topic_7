package com.product.server.koi_control_application.pojo.momo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MomoQueryRequest {
    private String requestId;   // ID yêu cầu
    private String orderId;     // ID đơn hàng
}