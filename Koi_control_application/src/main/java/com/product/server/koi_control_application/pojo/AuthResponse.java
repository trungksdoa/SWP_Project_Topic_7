package com.product.server.koi_control_application.pojo;


import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

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
    private Collection<? extends GrantedAuthority> roles;
    private String accessToken;
}
