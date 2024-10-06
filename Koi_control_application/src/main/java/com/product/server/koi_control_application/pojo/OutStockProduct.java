package com.product.server.koi_control_application.pojo;

import com.product.server.koi_control_application.model.Product;
import lombok.*;

import java.util.List;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutStockProduct {
    private List<Product> outStockProducts;
}
