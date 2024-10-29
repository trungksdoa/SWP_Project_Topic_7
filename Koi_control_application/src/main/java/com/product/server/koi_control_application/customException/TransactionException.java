package com.product.server.koi_control_application.customException;

public class TransactionException extends org.springframework.transaction.TransactionException {
    public TransactionException(String message) {
        super(message);
    }
}
