package com.product.server.koi_control_application.pojo.momo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MomoUserInfo {
    private String name;        // Tên của người dùng
    private String phoneNumber; // Số điện thoại của người dùng
    private String email;       // Email của người dùng
}