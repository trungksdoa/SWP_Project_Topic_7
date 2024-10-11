package com.product.server.koi_control_application.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_parameter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nitrite_no2", precision = 10, scale = 2)
    private BigDecimal nitriteNO2;

    @Column(name = "nitrate_no3", precision = 10, scale = 2)
    private BigDecimal nitrateNO3;

    @Column(name = "ammonium_nh4", precision = 10, scale = 2)
    private BigDecimal ammoniumNH4;

    @Column(name = "hardness_gh", precision = 10, scale = 2)
    private BigDecimal hardnessGH;

    @Column(precision = 10, scale = 2)
    private BigDecimal salt;

    @Column(precision = 10, scale = 2)
    private BigDecimal temperature;

    @Column(precision = 10, scale = 2)
    private BigDecimal pH;

    @Column(name = "carbonate_hardness_kh", precision = 10, scale = 2)
    private BigDecimal carbonateHardnessKH;

    @Column(precision = 10, scale = 2)
    private BigDecimal co2;

    @Column(name = "total_chlorines", precision = 10, scale = 2)
    private BigDecimal totalChlorines;

    @Column(name = "amount_fed", precision = 10, scale = 2)
    private BigDecimal amountFed;

    @Column(name = "pond_id")
    private int pondId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_cleaned_at")
    private LocalDate lastCleanedAt;

    @Column(name= "cleaned_day_count")
    private long cleanedDayCount;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastCleanedAt = LocalDate.now();
        getDaysSinceLastCleaned();
    }
    public void getDaysSinceLastCleaned() {
        if (lastCleanedAt != null && !lastCleanedAt.isEqual(LocalDate.now())) {
            this.cleanedDayCount = java.time.temporal.ChronoUnit.DAYS.between(lastCleanedAt, LocalDate.now());
        }else this.cleanedDayCount = 0;
    }


    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        getDaysSinceLastCleaned();
    }
}
