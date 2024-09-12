package com.product.server.koi_control_application.dto;

import com.product.server.koi_control_application.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private int id;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private Role roles;
}
