package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.KoiFish;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KoiFishRepository extends JpaRepository<KoiFish, Integer> {
    boolean existsByName(String name);
    boolean existsByNameAndPondId(String name, int pondId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM KoiFish c WHERE c.name = :name AND c.pondId = :pondId AND c.id <> :id")
    boolean existsByNameAndPondIdExceptId(@Param("name") String name,
                                          @Param("pondId") int pondId,
                                          @Param("id") int id);

    Page<KoiFish> findAllByPondId(int pondId, Pageable pageable);

    Page<KoiFish> findAllByUserId(int userId, Pageable pageable);
    int countByPondId(int pondId);
}
