package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
@Transactional
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    @Query("select o from Orders o where o.userId = ?1")
    Page<Orders> findOrdersByUserId(int userId, Pageable pageable);

    @Query("select o from Orders o where o.userId = ?1")
    Orders findOrderByUserIds(int userId);

    @Query("select o from Orders o where o.userId = ?1 and o.id = ?2")
    Orders findByUserIdAndId(int userId, int id);

    @Override
    void deleteById(Integer integer);

    @Query("select o from Orders o where o.userId = ?1")
    List<Orders> findByUserId(int userId);
}
