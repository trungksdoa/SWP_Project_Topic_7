package com.product.server.koi_control_application.mappingInterface;

public interface OrderMappings {
    String BASE_ORDER = "/api/orders";
    String CREATE_ORDER = "/create-product-order";
    String VERIFY_ORDER = "/receive-order";
    String SEND_ORDER = "/send-order";
    String GET_ORDER_BY_ID = "/{id}";
    String GET_ORDER_STATUS = "/status/{orderId}";
    String GET_ORDER_BY_USER = "/user/{userId}";
    String GET_ORDER_LIST_BY_USER = "/user/{userId}/list";
    String CANCEL_PENDING_ORDER = "/user/{userId}/order/{orderId}";
}
