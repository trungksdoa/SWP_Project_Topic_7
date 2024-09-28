package com.product.server.koi_control_application.enums;

public enum OrderStatus {
    PENDING("PENDING"),
    PAID("PAID"),
    CANCELED("CANCELED");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}