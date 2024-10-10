package com.product.server.koi_control_application.customException;

public class OrderExpiredException extends RuntimeException {
    public OrderExpiredException(String message) {
        super(message);
    }
}
