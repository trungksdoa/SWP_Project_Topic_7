package com.product.server.koi_control_application.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Table(name = "koi_growth_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class KoiGrowthHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "in_pond_from")
    private LocalDateTime inPondFrom;

    @Positive(message = "Width must be positive")
    @Column(precision = 10, scale = 2)
    private BigDecimal weight;

    @Positive(message = "Length must be positive")
    @Column(precision = 10, scale = 2)
    private BigDecimal length;

    @Column(name = "is_first_measurement")
    private Boolean isFirstMeasurement;

    @Column(name = "koi_id")
    private int koiId;

    @Column(name = "pond_id", nullable = true)
    private Integer pondId;

    @Column(name = "age_month_his")
    private Double ageMonthHis;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name= "date", nullable = true)
    private LocalDate date;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status")
    private Integer status;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        countageMonth();
    }
    public void countageMonth() {
        if(dateOfBirth != null) {
            Period period = Period.between(dateOfBirth,date);
            this.ageMonthHis = (double)(period.getYears()*12)+ period.getMonths();
        }else {
            this.ageMonthHis =(double) 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

