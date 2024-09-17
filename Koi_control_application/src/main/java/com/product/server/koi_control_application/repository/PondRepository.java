package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Pond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface PondRepository extends JpaRepository<Pond, Integer> {
    boolean existsByNameAndBreeder(String name, int breeder);

    Page<Pond> findAllByBreeder(int breeder, Pageable pageable);
    boolean existsById(int breeder);
    boolean existsByIdAndBreeder(int id, int breeder);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM Pond c WHERE c.name = :name AND c.breeder = :breeder AND c.id <> :id")
    boolean existsByNameAndBreederExceptId(@Param("name") String name,
                                           @Param("breeder") int breeder,
                                           @Param("id") int id);
}
