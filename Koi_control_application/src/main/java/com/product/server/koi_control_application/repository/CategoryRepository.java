package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}