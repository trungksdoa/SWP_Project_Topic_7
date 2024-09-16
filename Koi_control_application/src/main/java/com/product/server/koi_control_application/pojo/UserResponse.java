package com.product.server.koi_control_application.pojo;

import com.product.server.koi_control_application.model.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserResponse {
    private int id;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private boolean active;
    private Set<UserRole> role;
}
