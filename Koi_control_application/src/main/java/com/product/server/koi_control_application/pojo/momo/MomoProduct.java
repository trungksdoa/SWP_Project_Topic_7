package com.product.server.koi_control_application.pojo.momo;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoProduct {
    private String id;              // SKU number
    private String name;            // Tên sản phẩm
    private String description;     // Miêu tả sản phẩm
    private String category;        // Phân loại ngành hàng của sản phẩm
    private String imageUrl;        // Link hình ảnh của sản phẩm
    private String manufacturer;    // Tên nhà sản xuất
    private Long price;             // Đơn giá
    private String currency;        // VND
    private Integer quantity;       // Số lượng của sản phẩm. Cần là một số lớn hơn 0
    private String unit;            // Đơn vị đo lường của sản phẩm này
    private Long totalPrice;        // Tổng giá = Đơn giá x Số lượng
    private Long taxAmount;         // Tổng thuế
}