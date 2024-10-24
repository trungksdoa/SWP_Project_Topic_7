package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.UserRegister;
import com.product.server.koi_control_application.pojo.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * This interface defines the contract for user-related operations.
 * It provides methods for user registration, retrieval, login, password management,
 * and user package management.
 */
public interface IUserService {

    /**
     * Retrieves a user by their ID.
     *
     * @param id The ID of the user to retrieve.
     * @return   The Users object corresponding to the provided ID.
     */
    Users getUser(int id);

    /**
     * Retrieves a user by their email address.
     *
     * @param email The email address of the user to retrieve.
     * @return      The Users object corresponding to the provided email.
     */
    Users getUsersByEmail(String email);

    /**
     * Retrieves a paginated list of users.
     *
     * @param page The page number to retrieve.
     * @param size The number of users per page.
     * @return     A Page containing the list of Users objects.
     */
    Page<Users> getUsers(int page, int size);

    /**
     * Retrieves a list of all users.
     *
     * @return A List of all Users objects.
     */
    List<Users> getUsers();

    /**
     * Deletes a user by their ID.
     *
     * @param id The ID of the user to delete.
     */
    void deleteUser(int id);

    /**
     * Registers a new user.
     *
     * @param register The UserRegister object containing user registration details.
     * @return        The created Users object.
     */
    Users saveUser(UserRegister register);


    /**
     * Generates a new random password.
     *
     * @return The newly generated password as a String.
     */
    String generateNewPassword();

    /**
     * Updates the password for a user.
     *
     * @param email       The email address of the user.
     * @param newPassword The new password to set for the user.
     */
    void updatePassword(String email, String newPassword);

    /**
     * Updates user information, including an optional profile picture.
     *
     * @param id          The ID of the user to update.
     * @param userPatchDTO The Users object containing updated user details.
     * @param file        The MultipartFile representing the user's profile picture (if provided).
     * @throws IOException If an error occurs while processing the file.
     */
    void updateUser(int id, Users userPatchDTO, MultipartFile file) throws IOException;

    /**
     * Updates user information without a profile picture.
     *
     * @param userPatchDTO The Users object containing updated user details.
     */
    void updateUser(Users userPatchDTO);

    /**
     * Adds a package to a user.
     *
     * @param userId     The ID of the user to whom the package will be added.
     * @param userPackage The UserPackage object to be added.
     */
    void addPackage(int userId, UserPackage userPackage);

    void lockedUser(int userId);

    void unlockUser(int userId);
}