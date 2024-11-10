package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.TodoTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TodoTaskRepository extends JpaRepository<TodoTask, Integer> {
    @Query("select t from TodoTask t where t.userId = ?1")
    List<TodoTask> findAllByUserId(int userId);

    @Query("SELECT MAX(t.placeIndex) FROM TodoTask t")
    Optional<Integer> findMaxPlaceIndex();
}