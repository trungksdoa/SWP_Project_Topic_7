package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.UserRegister;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


public interface IUserService {


    void userRegisterMail(String email, Users savedUser);

    Users getUser(int id);

    Users getUsersByEmail(String email);

    Users getUsersByUsername(String username);

    Users userLogin(String username, String password);

    Page<Users> getUsers(int page, int size);

    List<Users>  getUsers();
    void deleteUser(int id);

    Users saveUser(UserRegister register);

    void resetPassword(String email);

    String generateNewPassword();

    void updatePassword(String email, String newPassword);

    Users updateUser(int id, Users userPatchDTO, MultipartFile file) throws IOException;

    Users updateUser(Users userPatchDTO);

    Users addPackage(int userId, UserPackage userPackage);
}
