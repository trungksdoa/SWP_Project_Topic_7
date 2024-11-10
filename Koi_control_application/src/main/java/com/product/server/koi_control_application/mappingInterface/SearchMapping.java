package com.product.server.koi_control_application.mappingInterface;

public interface SearchMapping {
    //Product search
    String BASE_SEARCH = "/search";
    String GET_PRODUCT_BY_NAME = "/product/name/{name}";
    String GET_PRODUCT_BY_PRICE = "/price/{price}";
    String GET_PRODUCT_BY_BRAND = "/brand/{brand}";
    String GET_PRODUCT_BY_COLOR = "/color/{color}";
    String GET_PRODUCT_BY_SIZE = "/size/{size}";

    String GET_PRODUCT_BY_PRICE_RANGE = "/price-range";
    String GET_PRODUCT_BY_CATEGORY_AND_PRICE_RANGE = "/category-price-range";

    //User
    String GET_USER_BY_NAME = "/name/{name}";
    String GET_USER_BY_EMAIL = "/email/{email}";
    String GET_USER_BY_PHONE = "/phone/{phone}";
    String GET_USER_BY_ADDRESS = "/address/{address}";


    //Order
    String GET_ORDER_BY_USER = "/user/{userId}";
    String GET_ORDER_BY_STATUS = "/status/{status}";
    String GET_ORDER_BY_DATE = "/date/{date}";
    String GET_ORDER_BY_TOTAL = "/total/{total}";


}
