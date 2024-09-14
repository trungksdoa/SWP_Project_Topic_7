package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.dto.BaseResponse;
import com.product.server.koi_control_application.dto.LoginRequest;
import com.product.server.koi_control_application.dto.UserResponse;
import com.product.server.koi_control_application.model.Role;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")

public class UserController {

    private final IUserService userService;

    @GetMapping("{userId}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable int userId) {
        BaseResponse response = BaseResponse.builder().data(userService.getUser(userId)).statusCode(HttpStatus.OK.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BaseResponse> registerUser(@RequestBody Users users) {
        BaseResponse response;
        users.setRoles(Role.ROLE_USER);
        Users savedUser = userService.saveUser(users);
        UserResponse userResponse = UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .address(savedUser.getAddress())
                .phoneNumber(savedUser.getPhoneNumber())
                .roles(Role.ROLE_USER)
                .build();
        response = BaseResponse.builder().data(userResponse).statusCode(HttpStatus.CREATED.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/auth")
    public ResponseEntity<BaseResponse> userLogin(@RequestBody LoginRequest loginRequest) {
        BaseResponse response = BaseResponse.builder()
                .data(userService.userLogin(loginRequest.getEmail(), loginRequest.getPassword()))
                .statusCode(HttpStatus.OK.value()
                ).message("Success")
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/reset")
    public ResponseEntity<BaseResponse> resetPassword(@RequestParam String email) {
        userService.resetPassword(email);
        BaseResponse response = BaseResponse.builder()
                .data("Password reset link sent to your email")
                .statusCode(HttpStatus.OK.value())
                .message("Success")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}
