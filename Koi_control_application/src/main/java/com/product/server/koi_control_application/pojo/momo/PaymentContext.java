package com.product.server.koi_control_application.pojo.momo;

import com.product.server.koi_control_application.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentContext {
    private String orderId;
    private String orderType;
    private Long transId;
    private String userId;
    private String description;

    public static PaymentContext fromCallback(MomoCallbackResponse response) {
        String[] parts = response.getOrderId().split("-");
        return PaymentContext.builder()
                .orderId(parts[0])
                .orderType(parts[1])
                .userId(parts[2])
                .transId(response.getTransId()).description(response.getMessage()).build();
    }

    public boolean isProductOrder() {
        return "product".equals(orderType);
    }
}