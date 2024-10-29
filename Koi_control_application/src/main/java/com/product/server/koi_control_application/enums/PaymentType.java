package com.product.server.koi_control_application.enums;

public enum PaymentType {
    PRODUCT("product"),
    PACKAGE("package");

    private String value;

    PaymentType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
