package com.product.server.koi_control_application.enums;

public enum OrderCode {
    //Control in customer ui
    PENDING("PENDING"),
    CANCELLED("CANCELLED"),
    SUCCESS("SUCCESS"),
    SEND("SEND"), // Added status
    RECEIVED("RECEIVED");  // Added status


    private final String value;

    OrderCode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
