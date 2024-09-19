package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.customException.ForbiddenException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.*;
import com.product.server.koi_control_application.serviceInterface.IEmailService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class UserController {

    private final IUserService userService;
    private final AuthenticationManager authManager;
    private final JwtTokenUtil jwtUtil;
    private final IEmailService emailService;

    @GetMapping("{userId}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable int userId) {
        Users user = userService.getUser(userId);
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRoles())
                .build();
        BaseResponse response = BaseResponse.builder().data(userResponse).statusCode(HttpStatus.OK.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<BaseResponse> registerUser(@RequestBody userRegister users) throws UnsupportedEncodingException {
        Users savedUser = userService.saveUser(users);

        userService.userRegisterMail(
                URLEncoder.encode(savedUser.getEmail(), StandardCharsets.UTF_8),
                savedUser
        );

        UserResponse userResponse = UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .address(savedUser.getAddress())
                .phoneNumber(savedUser.getPhoneNumber())
                .build();
        BaseResponse response = BaseResponse.builder().data(userResponse).statusCode(HttpStatus.CREATED.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<BaseResponse> userLogin(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(), loginRequest.getPassword())
            );

            Users user = (Users) authentication.getPrincipal();


            if(!user.isActive()) {
               throw new ForbiddenException("Account is not activated");
            }

            String accessToken = jwtUtil.generateAccessToken(user);


            BaseResponse response = BaseResponse.builder()
                    .data(new AuthResponse(user.getId(), user.getEmail(), user.getUsername(), user.getAddress(), user.getPhoneNumber(), user.isActive(), user.getRoles(), accessToken))
                    .statusCode(HttpStatus.OK.value()
                    ).message("Login successful")
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Incorrect email or password", ex);
        }


    }

    @PostMapping("/forgot-password")
    public ResponseEntity<BaseResponse> forgotPassword(@RequestBody @Valid EmailRequest emailRequest) {
        try {
            String newPassword = userService.generateNewPassword();
            userService.updatePassword(emailRequest.getEmail(), newPassword);
            emailService.sendPasswordToEmail(emailRequest.getEmail(), newPassword);

            BaseResponse response = BaseResponse.builder()
                    .data("A new password has been sent to your email")
                    .statusCode(HttpStatus.OK.value())
                    .message("Success")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (NotFoundException e) {
            BaseResponse response = BaseResponse.builder()
                    .data(null)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .message("User not found")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    public String decodeEmail(String encodedEmail) {
        try {
            return URLDecoder.decode(encodedEmail, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/verify/email/{email}")
    public ResponseEntity<BaseResponse> verifyEmail(@PathVariable String email) {
        try {
            Users user = userService.getUsersByEmail(decodeEmail(email));
            user.setActive(true);
            userService.updatedUser(user);
            BaseResponse response = BaseResponse.builder()
                    .data("Success")
                    .statusCode(HttpStatus.OK.value())
                    .message("Validate email success, your account have been activated")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (NotFoundException e) {
            BaseResponse response = BaseResponse.builder()
                    .data(null)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .message("User not found")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    @PatchMapping("/{id}")
    public ResponseEntity<BaseResponse> patchUser(@PathVariable int id, @RequestBody UserPatchDTO userPatchDTO) {
        userService.updateUser(id, userPatchDTO);
        BaseResponse response = BaseResponse.builder()
                .data("Update success")
                .statusCode(HttpStatus.OK.value())
                .message("User updated successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/test")
    @RolesAllowed("ROLE_ADMIN")
    public String test() {
        return "Hello admin";
    }

}
