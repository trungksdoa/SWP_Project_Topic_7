package com.product.server.koi_control_application.pojo;


import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartDTO {
    private int productId;
    private int quantity;
}
