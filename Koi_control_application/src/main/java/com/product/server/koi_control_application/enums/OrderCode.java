package com.product.server.koi_control_application.enums;
import io.swagger.v3.oas.annotations.media.Schema;;
public enum OrderCode {
    @Schema(description = "Order is pending")
    PENDING("PENDING"),

    @Schema(description = "Order has been cancelled")
    CANCELLED("CANCELLED"),

    @Schema(description = "Order has been successfully completed")
    SUCCESS("SUCCESS"),

    @Schema(description = "Order is being shipped")
    SHIPPING("SHIPPING"),

    @Schema(description = "Order has been delivered")
    DELIVERED("DELIVERED"),

    @Schema(description = "Order completed")
    COMPLETED("COMPLETED");

    private final String value;

    OrderCode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
