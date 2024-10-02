package com.product.server.koi_control_application.enums;

public enum ORDER {
    PENDING("PENDING"),
    SUCCESS("SUCCESS"),
    CANCELLED("CANCELLED");

    private final String value;

    ORDER(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
