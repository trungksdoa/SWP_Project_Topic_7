package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Blogs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogsRepository extends JpaRepository<Blogs, Integer> {
}