package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.KoiFish;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
@RepositoryRestResource(exported = false)
public interface KoiFishRepository extends JpaRepository<KoiFish, Integer> {
    boolean existsByName(String name);
    boolean existsByNameAndPondId(String name, int pondId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
            "FROM KoiFish c WHERE c.name = :name AND c.pondId = :pondId AND c.id <> :id")
    boolean existsByNameAndPondIdExceptId(@Param("name") String name,
                                          @Param("pondId") int pondId,
                                          @Param("id") int id);


    Page<KoiFish> findAllByPondId(int pondId, Pageable pageable);
    List<KoiFish> findAllByPondId(int pondId);

    int countByPondId(int pondId);

    long countByUserId(int userId);

    @Query("select k from KoiFish k where k.userId = ?1")
    Page<KoiFish> findAllByUserId(int userId, Pageable pageable);
    @Query("select k from KoiFish k where k.userId = ?1 ")
    List<KoiFish> findAllByUserId(int userId);

    @Query("select k from KoiFish k where k.userId = ?1 and k.pondId is null or k.pondId = 0")
    List<KoiFish> findFishByUserWithNoPond(int userId);


}
