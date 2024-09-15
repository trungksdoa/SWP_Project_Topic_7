package com.product.server.koi_control_application.pojo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotNull @Email
    private String email;
    @NotNull
    private String password;
}
