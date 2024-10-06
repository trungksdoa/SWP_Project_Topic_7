package com.product.server.koi_control_application.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PaymentCode {
    PENDING("PENDING"),
    PAID("PAID"),
    FAILED("FAILED");

    private String value;


}
