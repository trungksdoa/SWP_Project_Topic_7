package com.product.server.koi_control_application.pojo.momo;

import com.product.server.koi_control_application.model.PaymentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentContext {
    private String orderId;
    private String orderType;
    private String userId;
    private PaymentStatus status;
    private String description;

    public static PaymentContext fromCallback(MomoCallbackResponse response) {
        String[] parts = response.getOrderId().split("-");
        return PaymentContext.builder()
            .orderId(parts[0])
            .orderType(parts[1])
            .userId(parts[2])
            .build();
    }

    public boolean isProductOrder() {
        return "product".equals(orderType);
    }
}