package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Orders;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


@Transactional
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    @Query("select o from Orders o where o.userId = ?1")
    Page<Orders> findOrdersByUserId(int userId, Pageable pageable);

    @Query("select o from Orders o where o.userId = ?1")
    Orders findOrderByUserIds(int userId);

    @Query("select o from Orders o where o.userId = ?1 and o.id = ?2")
    Orders findByUserIdAndId(int userId, int id);
}
