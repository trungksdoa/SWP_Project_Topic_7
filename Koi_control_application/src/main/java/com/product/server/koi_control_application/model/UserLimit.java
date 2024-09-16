package com.product.server.koi_control_application.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_limit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int userId;
    private int fishLimit;
    private int pondLimit;
}
