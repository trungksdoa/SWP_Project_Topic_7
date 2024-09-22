package com.product.server.koi_control_application.custom_exception;

public class ClientErrorException extends RuntimeException{
    public ClientErrorException(String message) {
        super(message);
    }
}
