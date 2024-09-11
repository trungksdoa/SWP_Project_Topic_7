package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Users;
import org.springframework.data.domain.Page;


public interface IUserService {
    void saveUser(Users user);
    Users getUser(int id);
    Page<Users> getUsers(int page, int size);
    void deleteUser(int id);
    void updateUser(Users user);

    boolean checkPassword(String password, String encodedPassword);

    void addPackage(int id, int packageId);
}
