package com.product.server.koi_control_application.CustomException;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String value) {
        super("User not found with id: " + value);
    }
}
