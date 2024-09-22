package com.product.server.koi_control_application.custom_exception;

public class InsufficientException extends RuntimeException {
    public InsufficientException(String message) {
        super(message);
    }
}
