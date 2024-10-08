package com.product.server.koi_control_application.pojo.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CartDTO {
    @NotNull(message = "Product ID must not be empty")
    private int productId;

    @Size(min = 1, message = "Quantity must not less than 1")
    private int quantity;
}
