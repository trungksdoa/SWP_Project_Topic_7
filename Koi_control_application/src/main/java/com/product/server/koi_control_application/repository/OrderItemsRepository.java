package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {
    @Query("select o from OrderItems o where o.orderId = ?1")
    List<OrderItems> findByOrderId(int orderId);
}