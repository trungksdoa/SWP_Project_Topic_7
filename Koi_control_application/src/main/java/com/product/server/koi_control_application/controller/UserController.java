package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.AuthResponse;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.LoginRequest;
import com.product.server.koi_control_application.pojo.UserResponse;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.service.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN","ROLE_MEMBER","ROLE_SHOP"})
public class UserController {

    private final IUserService userService;
    private final  AuthenticationManager authManager;
    private final JwtTokenUtil jwtUtil;
    @GetMapping("{userId}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable int userId) {
        BaseResponse response = BaseResponse.builder().data(userService.getUser(userId)).statusCode(HttpStatus.OK.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<BaseResponse> registerUser(@RequestBody Users users) {
        BaseResponse response;
        Users savedUser = userService.saveUser(users);
        UserResponse userResponse = UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .address(savedUser.getAddress())
                .phoneNumber(savedUser.getPhoneNumber())
                .build();
        response = BaseResponse.builder().data(userResponse).statusCode(HttpStatus.CREATED.value()).message("Success").build();
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
            String accessToken = jwtUtil.generateAccessToken(user);



            BaseResponse response = BaseResponse.builder()
                    .data(new AuthResponse(user.getEmail(), accessToken))
                    .statusCode(HttpStatus.OK.value()
                    ).message("Success")
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


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


    @GetMapping("/test")
    @RolesAllowed("ROLE_ADMIN")
    public String test(){
        return "Hello admin";
    }

}
