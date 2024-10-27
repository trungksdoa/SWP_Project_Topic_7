package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping("/page")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> fetchAllUser(@RequestParam int page, @RequestParam int size) {
        return ResponseUtil.createSuccessResponse(userService.getUsers(page, size), "Access granted");
    }

    @PostMapping("/{userId}/suspend")
    @Operation(summary = "Suspend user", description = "Suspends a user account")
    public ResponseEntity<BaseResponse> suspendUser(@PathVariable int userId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{userId}/activate")
    @Operation(summary = "Activate user", description = "Activates a suspended user account")
    public ResponseEntity<BaseResponse> activateUser(@PathVariable int userId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Searches for users based on various criteria")
    public ResponseEntity<BaseResponse> searchUsers(@RequestParam String query, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get user statistics", description = "Retrieves various statistics about user accounts")
    public ResponseEntity<BaseResponse> getUserStatistics() {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{userId}/change-role")
    @Operation(summary = "Change user role", description = "Changes the role of a user account")
    public ResponseEntity<BaseResponse> changeUserRole(@PathVariable int userId, @RequestBody @Valid Map<String, Object> changeRoleDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }
}
