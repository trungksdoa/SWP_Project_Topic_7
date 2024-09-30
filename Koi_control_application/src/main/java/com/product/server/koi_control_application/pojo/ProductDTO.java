package com.product.server.koi_control_application.pojo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String name;
    private int price;
    private String description;
    private String imageUrl;
    private Integer stock;
    private int categoryId;
}
