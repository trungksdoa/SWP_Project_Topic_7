package com.product.server.koi_control_application.customException;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) {
        super("Product with name: " + message + " not found");
    }
}
