package com.product.server.koi_control_application.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.custom_exception.ForbiddenException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.*;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.product.server.koi_control_application.pojo.momo.MomoProduct;
import com.product.server.koi_control_application.pojo.momo.MomoUserInfo;
import com.product.server.koi_control_application.service_interface.IEmailService;
import com.product.server.koi_control_application.service_interface.IPackageService;
import com.product.server.koi_control_application.service_interface.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static com.product.server.koi_control_application.ultil.PaymentUtil.PAYMENT_URL;
import static com.product.server.koi_control_application.ultil.PaymentUtil.sendHttpRequest;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class UserController {

    private final IUserService userService;
    private final AuthenticationManager authManager;
    private final JwtTokenUtil jwtUtil;
    private final IEmailService emailService;
    private final IPackageService packageService;
    private final PaymentController paymentController;

    @GetMapping("{userId}")
    public ResponseEntity<BaseResponse> getUser(@PathVariable int userId) {
        Users user = userService.getUser(userId);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .avatar(user.getAvatarUrl())
                .build();
        BaseResponse response = BaseResponse.builder().data(userResponse).statusCode(HttpStatus.OK.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<BaseResponse> registerUser(@RequestBody UserRegister users) {

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


            if (!user.isActive()) {
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
        return URLDecoder.decode(encodedEmail, StandardCharsets.UTF_8);
    }

    @GetMapping("/verify/email/{email}")
    public ResponseEntity<BaseResponse> verifyEmail(@PathVariable String email) {
        try {
            Users user = userService.getUsersByEmail(decodeEmail(email));
            user.setActive(true);
            userService.updateUser(user);
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


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole({'ROLE_MEMBER', 'ROLE_ADMIN','ROLE_SHOP'})")
    public ResponseEntity<BaseResponse> patchUser(@PathVariable("id") int userId, @RequestPart("user") String userJson, @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Users userData = objectMapper.readValue(userJson, Users.class);


        userService.updateUser(userId, userData, file);
        BaseResponse response = BaseResponse.builder()
                .data("Update success")
                .statusCode(HttpStatus.OK.value())
                .message("User updated successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/add-package")
    @PreAuthorize("hasRole({'ROLE_MEMBER', 'ROLE_ADMIN','ROLE_SHOP'})")
    public ResponseEntity<BaseResponse> createServiceOrder(@RequestBody OrderPackageRequest req, HttpServletRequest request) throws Exception {
        int userId = jwtUtil.getUserIdFromToken(request);
        UserPackage pack = packageService.getPackageById(req.getPackageId());

        BaseResponse response = BaseResponse.builder()
                .data(handlePackage(userService.getUser(userId), pack))
                .statusCode(HttpStatus.CREATED.value())
                .message("Service order created successfully")
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    private JsonNode handlePackage(Users users, UserPackage pack) throws Exception {
        List<MomoProduct> momoProducts = new ArrayList<>();

        MomoUserInfo momoUserInfo = new MomoUserInfo();
        momoUserInfo.setName(users.getUsername());
        momoUserInfo.setPhoneNumber(users.getPhoneNumber());
        momoUserInfo.setEmail(users.getEmail());

        MomoPaymentRequest momoPaymentRequest = MomoPaymentRequest.builder()
                .amount(Long.parseLong(pack.getPrice() + ""))
                .orderInfo("Payment for package " + pack.getName())
                .requestId(UUID.randomUUID().toString())
                .userId(String.valueOf(users.getId()))
                .orderId(String.valueOf(pack.getId()))
                .orderType("package")
                .momoProducts(momoProducts)
                .momoUserInfo(momoUserInfo)
                .build();
        String jsonBody = new ObjectMapper().writeValueAsString(momoPaymentRequest);
        HttpResponse<String> response = sendHttpRequest(jsonBody,PAYMENT_URL);
        return new ObjectMapper().readTree(response.body());
    }

}
