package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}