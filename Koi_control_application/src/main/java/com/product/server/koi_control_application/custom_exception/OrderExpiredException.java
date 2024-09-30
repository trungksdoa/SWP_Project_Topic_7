package com.product.server.koi_control_application.custom_exception;

public class OrderExpiredException extends RuntimeException {
    public OrderExpiredException(String message) {
        super(message);
    }
}
