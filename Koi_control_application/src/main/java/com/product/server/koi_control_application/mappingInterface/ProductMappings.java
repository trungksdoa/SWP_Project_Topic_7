package com.product.server.koi_control_application.mappingInterface;

public interface ProductMappings {
    String BASE_PRODUCT = "/api/products";
    String GET_PRODUCT_BY_ID = "/{id}";
    String GET_BY_SLUG = "/name/{slug}";
    String GET_BY_CATEGORY = "/category/{categoryId}";
    String GET_ALL_PRODUCT = "/fetchAll";
}