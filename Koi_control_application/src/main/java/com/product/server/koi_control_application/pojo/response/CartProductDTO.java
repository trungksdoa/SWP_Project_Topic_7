package com.product.server.koi_control_application.pojo.response;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartProductDTO {
    private int id;
    private int productId;
    private String imageUrl;
    private String name;
    private int price;
    private Integer stock;
    private Integer quantity;
    private boolean disabled;
    private boolean quantityChanged;
    private String message;

    public CartProductDTO(int id, int productId, String imageUrl, String name, int price, Integer stock, Integer quantity, boolean disabled) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.quantity = quantity;
        this.disabled = disabled;
    }
}
