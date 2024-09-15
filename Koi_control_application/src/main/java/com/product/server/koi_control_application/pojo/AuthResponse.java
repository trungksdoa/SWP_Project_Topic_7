package com.product.server.koi_control_application.pojo;


import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String email;
    private String username;
    private String address;
    private String phoneNumber;
    private boolean active;
    private String accessToken;
}
