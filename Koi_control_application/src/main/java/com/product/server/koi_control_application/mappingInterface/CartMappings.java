package com.product.server.koi_control_application.mappingInterface;

public interface CartMappings {
    String BASE_CART = "/api/carts";
    String REMOVE_CART_ITEM = "/remove/{productId}/user/{userId}";
    String GET_CART_BY_USER = "/user/{userId}";
    String PUT_CART = "/user/{userId}";
}
