package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Users;
import org.springframework.data.domain.Page;


public interface IUserService {
    Users saveUser(Users user);
    Users getUser(int id);

    Users getUsersByUsername(String username);

    Users userLogin(String username, String password);
    Page<Users> getUsers(int page, int size);

    void resetPassword(String email);
    void deleteUser(int id);
    void updateUser(Users user);

}
