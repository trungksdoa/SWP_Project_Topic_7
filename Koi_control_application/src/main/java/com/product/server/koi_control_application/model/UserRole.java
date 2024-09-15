package com.product.server.koi_control_application.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor

public class UserRole {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    public UserRole(int id){
        this.id = id;
    }

    public UserRole(String name){
        this.name = name;
    }


    @Override
    public String toString() {
        return this.name;
    }

}
