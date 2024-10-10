package com.product.server.koi_control_application.mappingInterface;

public interface UserMappings {
    String BASE_USER = "/api/users";
    String USER_GET_BY_ID = "/{userId}";
    String USER_REGISTER = "/auth/register";
    String USER_LOGIN = "/auth/login";
    String USER_FORGOT_PASSWORD = "/forgot-password";
    String USER_VERIFY_EMAIL = "/verify/email/{email}";
    String USER_UPDATE_BY_ID = "/{id}";
    String USER_ADD_PACKAGE = "/add-package";
}
