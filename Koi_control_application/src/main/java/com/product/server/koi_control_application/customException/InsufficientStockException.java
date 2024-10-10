package com.product.server.koi_control_application.customException;

public class InsufficientStockException extends RuntimeException{
    public InsufficientStockException(String message) {
        super(message, null, false, false);
    }
}
