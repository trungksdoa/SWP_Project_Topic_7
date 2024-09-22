package com.product.server.koi_control_application.custom_exception;

public class EmptyException extends RuntimeException {
    public EmptyException(String message) {
        super(message);
    }
}
