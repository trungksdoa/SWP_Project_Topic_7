package com.product.server.koi_control_application.repository;

import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.response.UserResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;


@Repository
@RepositoryRestResource(exported = false)
public interface UsersRepository extends JpaRepository<Users, Integer> {
    @Query("select u from Users u where u.username = ?1")
    Optional<Users> findByUsername(String username);

    @Query("select u from Users u where u.id = ?1")
    Optional<Users> fetchUsersById(int id);

    @Query("select u from Users u where u.username= ?1 and u.password = ?2")
    Optional<Users> fetchUserByUserNamePassword(@NonNull String username, @NonNull String password);

    @Query("select u from Users u where u.email = ?1 and u.password = ?2")
    Optional<Users> findByEmailAndPassword(String email, String password);

    @Query("select u from Users u where u.email = ?1")
    Optional<Users> findByEmail(String email);

    @Query("select u from Users u where u.email = ?1")
    Users fetchUserByEmail(String email);

//    @Query("SELECT new com.product.server.koi_control_application.pojo.response.UserResponseDTO(u.id, u.username, u.password, u.email, u.phoneNumber, u.address, u.active, u.createdAt, u.updatedAt) FROM Users u")
//    List<UserResponseDTO> fetchAllUsers();


    boolean existsById(int id);
}