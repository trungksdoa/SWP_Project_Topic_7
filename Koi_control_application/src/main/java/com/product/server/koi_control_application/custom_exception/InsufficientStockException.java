package com.product.server.koi_control_application.custom_exception;

public class InsufficientStockException extends RuntimeException{
    public InsufficientStockException(String message) {
        super(message, null, false, false);
    }
}
