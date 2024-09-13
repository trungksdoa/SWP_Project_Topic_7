package com.product.server.koi_control_application.dto;


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
