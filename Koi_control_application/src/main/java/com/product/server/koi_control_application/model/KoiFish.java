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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

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

    @Column(name = "age_month")
    private int ageMonth;

    @NotNull(message = "Purchase price is required")
    @Positive(message = "Purchase price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private int purchasePrice;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "pond_id", nullable = true)
    private Integer pondId;

    @Positive(message = "Width must be positive")
    @Column(precision = 10, scale = 2)
    private BigDecimal weight;

    @Positive(message = "Length must be positive")
    @Column(precision = 10, scale = 2)
    private BigDecimal length;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name= "date_of_birth")
    private LocalDate dateOfBirth;

    private LocalDate date;

    public void countageMonth() {
        if (dateOfBirth != null) {
            Period period = Period.between(dateOfBirth, LocalDate.now());
            this.ageMonth = (period.getYears() * 12) + period.getMonths();
        } else {
            this.ageMonth = 0;
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        countageMonth();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        countageMonth();
    }
}