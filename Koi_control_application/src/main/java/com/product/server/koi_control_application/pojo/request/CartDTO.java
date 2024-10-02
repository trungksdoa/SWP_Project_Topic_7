package com.product.server.koi_control_application.pojo.request;


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
