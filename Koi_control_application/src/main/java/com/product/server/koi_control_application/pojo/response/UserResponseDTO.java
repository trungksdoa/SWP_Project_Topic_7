package com.product.server.koi_control_application.pojo.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class UserResponseDTO {
    private int id;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String address;
    private boolean active = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
