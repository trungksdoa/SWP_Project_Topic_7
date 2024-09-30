package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
}