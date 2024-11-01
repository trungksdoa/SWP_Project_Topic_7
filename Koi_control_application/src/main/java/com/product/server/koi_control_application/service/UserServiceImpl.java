package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.customException.AlreadyExistedException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.model.UserRole;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.UserRegister;
import com.product.server.koi_control_application.pojo.response.UserResponseDTO;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IUserHelper;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IPackageService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;

/**
 * UserServiceImpl implements IUserService and provides user management functionality.
 * This service handles user operations such as registration, authentication, profile management,
 * and user-related data retrieval.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final IImageService imageService;
    private final IPackageService packageService;
    private final IUserHelper userHelper;

    /**
     * Registers a new user in the system.
     * Encodes the password, sets default avatar, assigns roles, and sends a verification email.
     *
     * @param register UserRegister object containing registration details
     * @return The saved User object
     * @throws AlreadyExistedException         if email or username already exists
     * @throws DataIntegrityViolationException for other database integrity issues
     */
    @Override
    @Transactional
    public Users saveUser(UserRegister register) {
        try {

            Users user = Users.builder()
                    .username(register.getUsername())
                    .email(register.getEmail())
                    .roles(new HashSet<>())
                    .build();


            user.setAvatarUrl(imageService.getDefaultImage("DefaultAvatar.png"));
            //Create user
            String passwordED = userHelper.passwordEncoded(register.getPassword());
            user.setPassword(passwordED);

            user.getRoles().add(new UserRole(register.getRole().getValue()));

            // Send email to user
           userHelper.userRegisterMail(register.getEmail(), user);

            user.setAUserPackage(packageService.getPackageByDefault());
            return usersRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            if (ex.getMessage().contains("users_email_unique")) {
                throw new AlreadyExistedException("Email already exists: " + register.getEmail());
            } else if (ex.getMessage().contains("users_username_unique")) {
                throw new AlreadyExistedException("Username already exists: " + register.getUsername());
            }
        }
        throw new DataIntegrityViolationException("Error occurred while saving user: user account already exists");
    }



    /**
     * Retrieves a user by their ID.
     *
     * @param id The ID of the user to retrieve
     * @return The User object
     * @throws NotFoundException if no user is found with the given ID
     */
    @Override
    public Users getUser(int id) {
        return usersRepository.fetchUsersById(id).orElseThrow(() -> new NotFoundException("No user found with id: " + id));
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param email The email address of the user to retrieve
     * @return The User object
     * @throws NotFoundException if no user is found with the given email
     */
    @Override
    public Users getUsersByEmail(String email) {
        return userHelper.getUsersByEmail(email);
    }




    /**
     * Retrieves a paginated list of users.
     *
     * @param page The page number
     * @param size The number of users per page
     * @return A Page object containing Users
     */
    @Override
    public Page<Users> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usersRepository.findAll(pageable);
    }

    /**
     * Retrieves all users in the system.
     *
     * @return A List of all User objects
     */
    @Override
    public List<Users> getUsers() {
        return usersRepository.findAll();
    }


    /**
     * Deletes a user from the system by their ID.
     *
     * @param id The ID of the user to delete
     * @throws NotFoundException if no user is found with the given ID
     */
    @Override
    @Transactional
    public void deleteUser(int id) {
        Users user = getUser(id);
        if (user == null) {
            throw new NotFoundException(String.valueOf(id));
        }
        user.removeRole();
        usersRepository.delete(user);
    }


    /**
     * Generates a new random password.
     *
     * @return A string containing the new password
     */
    @Override
    public String generateNewPassword() {
        return RandomStringUtils.random(12, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+");
    }

    /**
     * Updates the password for a user.
     *
     * @param email       The email address of the user
     * @param newPassword The new password to set
     * @throws NotFoundException if no user is found with the given email
     */
    @Override
    @Transactional
    public void updatePassword(String email, String newPassword) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);
    }

    /**
     * Updates user profile information, including avatar if provided.
     *
     * @param id    The ID of the user to update
     * @param rUser The User object containing updated information
     * @param file  The new avatar file (can be null)
     * @throws IOException       if there's an issue with file handling
     * @throws NotFoundException if no user is found with the given ID
     */
    @Override
    @Transactional
    public void updateUser(int id, Users rUser, MultipartFile file) throws IOException {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + rUser.getUsername()));

        if (file != null) {
            String filename = imageService.updateImage(user.getAvatarUrl(), file);
            user.setAvatarUrl(filename);
        }

        if (rUser.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(rUser.getPassword()));
        }
        if (rUser.getUsername() != null) {
            user.setUsername(rUser.getUsername());
        }
        if (rUser.getEmail() != null) {
            user.setEmail(rUser.getEmail());
        }
        if (rUser.getAddress() != null) {
            user.setAddress(rUser.getAddress());
        }
        if (rUser.getPhoneNumber() != null) {
            user.setPhoneNumber(rUser.getPhoneNumber());
        }

        usersRepository.save(user);
    }

    /**
     * Updates user information in the database.
     * @param rUser The User object to update
     */
    @Override
    public void updateUser(Users rUser) {
        usersRepository.save(rUser);
    }

    /**
     * Adds a package to a user's account.
     * @param userId The ID of the user
     * @param userPackage The UserPackage to add to the user's account
     */
    @Override
    @Transactional
    public void addPackage(int userId, UserPackage userPackage) {
        Users user = getUser(userId);
        user.setAUserPackage(userPackage);
        updateUser(user);
    }

    @Override
    @Transactional
    public void lockedUser(int userId) {
        Users user = getUser(userId);
        user.setActive(false);
        updateUser(user);
    }

    @Override
    @Transactional
    public void unlockUser(int userId) {
        Users user = getUser(userId);
        user.setActive(true);
        updateUser(user);
    }

}
