package com.product.server.koi_control_application.CustomException;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(int id) {
        super("User not found with id: " + id);
    }
}
