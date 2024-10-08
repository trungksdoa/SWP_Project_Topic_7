package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface BlogsRepository extends JpaRepository<Blogs, Integer> {
    @Query("select b from Blogs b where b.author = ?1")
    List<Blogs> findByAuthor(Users author);


    @Query("select b from Blogs b where b.slug = ?1")
    Optional<Blogs> findBySlug(String slug);

    @Query("SELECT b FROM Blogs b WHERE " +
            "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:headerTop IS NULL OR LOWER(b.headerTop) LIKE LOWER(CONCAT('%', :headerTop, '%'))) AND " +
            "(:headerMiddle IS NULL OR LOWER(b.headerMiddle) LIKE LOWER(CONCAT('%', :headerMiddle, '%')))")
    List<Blogs> searchByTitleAndHeader(@Param("title") String title,
                                       @Param("headerTop") String headerTop,
                                       @Param("headerMiddle") String headerMiddle);

    boolean existsByTitle(String title);
}