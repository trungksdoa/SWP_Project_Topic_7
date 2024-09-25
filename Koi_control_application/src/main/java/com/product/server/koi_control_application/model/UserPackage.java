package com.product.server.koi_control_application.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "fish_slots", nullable = false)
    private Integer fishSlots;

    @Column(name = "pond_slots", nullable = false)
    private Integer pondSlots;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Boolean isDefault = false;

    // toString method
    @Override
    public String toString() {
        return "UserPackage{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", fishSlots=" + fishSlots +
                ", pondSlots=" + pondSlots +
                ", price=" + price +
                ", isDefault=" + isDefault +
                '}';
    }
}