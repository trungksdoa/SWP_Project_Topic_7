package com.product.server.koi_control_application.customException;

public class UserExistedException extends RuntimeException {
    public UserExistedException(String message) {
        super("User " + message + " already existed");
    }
}
