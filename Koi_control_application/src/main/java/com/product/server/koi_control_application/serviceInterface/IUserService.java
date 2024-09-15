package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Users;
import org.springframework.data.domain.Page;


public interface IUserService {
    Users saveUser(Users user);
    Users getUser(int id);

    Users getUsersByUsername(String username);

    Users userLogin(String username, String password);
    Page<Users> getUsers(int page, int size);
    void deleteUser(int id);
    void updateUser(Users user);
    void resetPassword(String email);

    String generateNewPassword();

    void updatePassword(String email, String newPassword);
}
