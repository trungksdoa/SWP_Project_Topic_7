package com.product.server.koi_control_application.custom_exception;

public class PolicyViolationException extends RuntimeException {
    public PolicyViolationException(String message) {
        super(message);
    }
}