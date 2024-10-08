package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;



@Repository
@RepositoryRestResource(exported = false)
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
}