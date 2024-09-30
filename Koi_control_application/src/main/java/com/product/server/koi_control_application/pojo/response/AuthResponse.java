package com.product.server.koi_control_application.pojo.response;


import com.product.server.koi_control_application.model.UserRole;
import lombok.*;


import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private int id;
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private boolean active;
    private Set<UserRole> roles ;
    private String accessToken;
}
