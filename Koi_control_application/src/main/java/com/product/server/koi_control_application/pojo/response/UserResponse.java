package com.product.server.koi_control_application.pojo.response;

import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private int id;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private boolean active;
    private Set<UserRole> role;
    private UserPackage userPackage;

    private String avatar;
}
