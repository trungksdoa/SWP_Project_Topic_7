package com.product.server.koi_control_application.customException;

public class EmptyException extends RuntimeException {
    public EmptyException(String message) {
        super(message);
    }
}
