package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
@Transactional
public interface BlogsRepository extends JpaRepository<Blogs, Integer> {
    @Query("select b from Blogs b where b.author = ?1")
    List<Blogs> findByAuthor(Users author);
}