package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
}
