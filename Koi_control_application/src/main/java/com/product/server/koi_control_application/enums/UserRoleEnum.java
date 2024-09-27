package com.product.server.koi_control_application.enums;

public enum UserRoleEnum {
    ROLE_MEMBER(1),
    ROLE_ADMIN(2),
    ROLE_SHOP(3);

    private final int value;

    UserRoleEnum(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}