package com.product.server.koi_control_application.customException;

public class ClientErrorException extends RuntimeException{
    public ClientErrorException(String message) {
        super(message);
    }
}
