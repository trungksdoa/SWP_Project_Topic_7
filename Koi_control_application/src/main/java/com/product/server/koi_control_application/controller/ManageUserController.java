package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IUserService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manage/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*", allowedHeaders = {"Authorization", "Content-Type"})
public class ManageUserController {
    private final IUserService userService;
    @DeleteMapping("/{userId}")
    public ResponseEntity<BaseResponse> removeUser(@PathVariable int userId) {
        BaseResponse response;
        userService.deleteUser(userId);
        response = BaseResponse.builder()
                .data("User deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .message("Success")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> getAllUsers() {
        BaseResponse response;
        response = BaseResponse.builder().data(userService.getUsers()).statusCode(HttpStatus.OK.value()).message("Success").build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
