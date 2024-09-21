package com.product.server.koi_control_application.custom_exception;

public class AlreadyExistedException extends RuntimeException {
    public AlreadyExistedException(String message) {
        super(message);
    }
}
