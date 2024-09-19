package com.product.server.koi_control_application.pojo;

import lombok.Data;

@Data
public class UserPatchDTO {
    private String username;
    private String address;
    private String phone;
    private String password;
    // Thêm các trường khác nếu cần
}