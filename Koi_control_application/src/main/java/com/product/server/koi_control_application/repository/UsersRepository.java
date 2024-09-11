package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Integer> {
    @Query("select u from Users u where u.username = ?1")
    Optional<Users> findByUsername(String username);

    @Query("select u from Users u where u.id = ?1")
    Optional<Users> fetchUsersById(int id);
}