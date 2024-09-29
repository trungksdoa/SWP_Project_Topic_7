package com.product.server.koi_control_application.pojo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderProductDTO {

    private String fullName;

    private String phone;

    private String address;

}
