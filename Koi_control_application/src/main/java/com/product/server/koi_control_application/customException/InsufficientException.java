package com.product.server.koi_control_application.customException;

public class InsufficientException extends RuntimeException {
    public InsufficientException(String message) {
        super(message);
    }
}
