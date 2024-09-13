package com.product.server.koi_control_application.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "pond")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Pond name is required")
    @Size(max = 100, message = "Pond name must be less than 100 characters")
    @Column(name = "pond_name", nullable = false)
    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    @Positive(message = "Width must be positive")
    @Column(precision = 10, scale = 2)
    private int width;

    @Positive(message = "Length must be positive")
    @Column(precision = 10, scale = 2)
    private int length;

    @Size(max = 50, message = "Depth must be less than 50 characters")
    private String depth;

    @Positive(message = "Volume must be positive")
    @Column(precision = 10, scale = 2)
    private int volume;

    @PositiveOrZero(message = "Fish count must be zero or positive")
    @Column(name = "fish_count")
    private Integer fishCount;

    @Column(name = "breeder")
    private int breeder;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
