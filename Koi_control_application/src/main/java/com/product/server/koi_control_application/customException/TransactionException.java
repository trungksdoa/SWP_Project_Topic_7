package com.product.server.koi_control_application.customException;

public class TransactionException extends RuntimeException {
    public TransactionException(String message) {
        super(message);
    }
}
