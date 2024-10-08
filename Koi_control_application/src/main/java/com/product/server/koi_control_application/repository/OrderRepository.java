package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    @Query("select o from Orders o where o.userId = ?1")
    Page<Orders> findOrdersByUserId(int userId, Pageable pageable);

    @Query("select o from Orders o where o.userId = ?1 and o.id = ?2")
    Optional<Orders> findByUserIdAndId(int userId, int id);


    @Query("select o from Orders o where o.userId = ?1")
    List<Orders> findByUserId(int userId);
}
