package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.serviceInterface.IEmailService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.customException.EmailAlreadyExistsException;
import com.product.server.koi_control_application.customException.UserExistedException;
import com.product.server.koi_control_application.customException.UserNotFoundException;
import com.product.server.koi_control_application.customException.UsernameAlreadyExistsException;
import com.product.server.koi_control_application.model.UserRole;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.product.server.koi_control_application.model.UserRoleEnum.ROLE_MEMBER;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UsersRepository usersRepository;
    private final IEmailService service;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Users saveUser(Users user) {
        try {
            if (getUsersByUsername(user.getUsername()) == null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.getRoles().add(new UserRole(ROLE_MEMBER.getValue()));

                return usersRepository.save(user);
            }

        } catch (DataIntegrityViolationException ex) {
            if (ex.getMessage().contains("users_email_unique")) {
                throw new EmailAlreadyExistsException("Email already exists: " + user.getEmail());
            } else if (ex.getMessage().contains("users_username_unique")) {
                throw new UsernameAlreadyExistsException("Username already exists: " + user.getUsername());
            } else {
                throw ex;
            }
        }

        throw new UserExistedException(user.getUsername());
    }

    @Override
    public Users getUser(int id) {
        return usersRepository.fetchUsersById(id).orElseThrow(() -> new UserNotFoundException(String.valueOf(id)));
    }

    @Override
    public Users getUsersByEmail(String email) {
        return usersRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    public Users getUsersByUsername(String username) {
        return usersRepository.findByUsername(username).orElse(null);
    }

    @Override
    public Users userLogin(String email, String password) {
        return usersRepository.findByEmailAndPassword(email, password).orElseThrow(() -> new UserNotFoundException(email));
    }

    @Override
    public Page<Users> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return usersRepository.findAll(pageable);
    }

    @Override
    public void deleteUser(int id) {
        Users user = getUser(id);
        if (user == null) {
            throw new UserNotFoundException(String.valueOf(id));
        }
        usersRepository.delete(user);
    }

    @Override
    public void resetPassword(String email) {
        Users user = usersRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(email));
        usersRepository.save(user);
    }

    @Override
    public String generateNewPassword() {
        return RandomStringUtils.randomAlphanumeric(12);
    }

    @Override
    public void updatePassword(String email, String newPassword) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);
    }

    @Override
    public void updateUser(Users user) {
        // TODO document why this method is empty
    }



}
