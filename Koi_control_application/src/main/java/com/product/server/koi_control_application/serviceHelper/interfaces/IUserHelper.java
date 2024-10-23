package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.model.Users;

public interface IUserHelper {
    void userRegisterMail(String email, Users savedUser);
    Users getUser(int id);
    Users getUsersByEmail(String email);

    String passwordEncoded(String password);

    Users getUsersByUsername(String username);
    Users userLogin(String username, String password);
}
