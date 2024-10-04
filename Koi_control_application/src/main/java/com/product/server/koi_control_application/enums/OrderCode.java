package com.product.server.koi_control_application.enums;

public enum OrderCode {
    //Control in customer ui
    PENDING("PENDING"),
    SUCCESS("SUCCESS"),
    CANCELLED("CANCELLED");

    private final String value;

    OrderCode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
