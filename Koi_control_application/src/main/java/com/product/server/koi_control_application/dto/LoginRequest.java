package com.product.server.koi_control_application.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
