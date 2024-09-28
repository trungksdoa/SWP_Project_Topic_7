package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.UserPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
@Repository
@Transactional
@RepositoryRestResource(exported = false)
public interface PackageRepository extends JpaRepository<UserPackage, Integer> {

    @Transactional
    @Modifying
    @Query("update UserPackage u set u.isDefault = ?1")
    void updateAllIsDefault(Boolean isDefault);

    UserPackage findByIsDefault(Boolean isDefault);
}