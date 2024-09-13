package com.product.server.koi_control_application.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "koi_fish")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Koi name is required")
    @Size(max = 100, message = "Koi name must be less than 100 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Koi variety is required")
    @Size(max = 50, message = "Koi variety must be less than 50 characters")
    @Column(nullable = false)
    private String variety;

    @NotNull(message = "Koi sex is required")
    @Column(nullable = false)
    private Boolean sex;

    @NotNull(message = "Purchase price is required")
    @Positive(message = "Purchase price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private int purchasePrice;

    @Column(nullable = false)
    private int breeder;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "pond_id")
    private int pondId;

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