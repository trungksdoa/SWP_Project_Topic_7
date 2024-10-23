package com.product.server.koi_control_application.serviceHelper;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service.EmailServiceImpl;
import com.product.server.koi_control_application.serviceHelper.interfaces.IUserHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserHelper implements IUserHelper {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailServiceImpl emailService;


    /**
     * Sends a registration confirmation email to the user with a verification link.
     *
     * @param email     The email address of the registered user
     * @param savedUser The User object of the registered user
     */
    @Override
    public void userRegisterMail(String email, Users savedUser) {
        String verificationLink = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/users/verify/email/" + email;
        String emailBody = "Your account has been created successfully. Please verify your email to activate your account by clicking the following link: " + verificationLink;
        emailService.sendMail(savedUser.getEmail(), "Welcome to KOI Control Application", emailBody);
    }

    @Override
    public Users getUser(int id) {
        // Retrieve user by ID
        return null;
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
        return usersRepository.findByEmail(email).orElseThrow(() -> new NotFoundException(email));
    }

    @Override
    public String passwordEncoded(String password) {
        return passwordEncoder.encode(password);
    }


    /**
     * Retrieves a user by their username.
     *
     * @param username The username of the user to retrieve
     * @return The User object, or null if not found
     */
    @Override
    public Users getUsersByUsername(String username) {
        return usersRepository.findByUsername(username).orElse(null);
    }


    /**
     * Authenticates a user based on email and password.
     *
     * @param email    The email address of the user
     * @param password The password of the user
     * @return The authenticated User object
     * @throws NotFoundException if no user is found with the given email and password
     */
    @Override
    public Users userLogin(String email, String password) {
        return usersRepository.findByEmailAndPassword(email, password).orElseThrow(() -> new NotFoundException(email));
    }
}
