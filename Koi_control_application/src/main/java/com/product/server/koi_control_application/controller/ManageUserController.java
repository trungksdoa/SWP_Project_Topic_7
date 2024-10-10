package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manage/api/users")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*", allowedHeaders = {"Authorization", "Content-Type"})
@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "Admin API", description = "API for admin")
public class ManageUserController {
    private final IUserService userService;

    @DeleteMapping("/{userId}")
    public ResponseEntity<BaseResponse> removeUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return ResponseUtil.createSuccessResponse(null, "Access granted, user deleted");
    }


    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> fetchAllUser() {
        return ResponseUtil.createSuccessResponse(userService.getUsers(), "Access granted");
    }
}
