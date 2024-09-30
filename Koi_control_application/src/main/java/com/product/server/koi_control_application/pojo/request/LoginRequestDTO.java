package com.product.server.koi_control_application.pojo.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {
    @NotNull @Email(message = "Invalid email format")
    private String email;
    @NotNull
    private String password;
}
