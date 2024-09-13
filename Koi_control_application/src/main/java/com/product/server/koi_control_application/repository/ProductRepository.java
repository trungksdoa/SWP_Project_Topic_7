package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


@Transactional
public interface ProductRepository extends JpaRepository<Product, Integer> {


    @Query("select p from Product p where p.categoryId = ?1")
    Page<Product> findByCategoryId(int categoryId, Pageable pageable);
}
