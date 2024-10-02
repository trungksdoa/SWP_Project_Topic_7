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

    @Column(name = "nitrite_no2")
    private Integer nitriteNO2;

    @Column(name = "nitrate_no3")
    private Integer nitrateNO3;

    @Column(name = "ammonium_nh4")
    private Integer ammoniumNH4;

    @Column(name = "hardness_gh")
    private Integer hardnessGH;

    private Integer salt;

    private Integer temperature;
    private Integer pH;

    @Column(name = "carbonate_hardness_kh")
    private Integer carbonateHardnessKH;

    private Integer co2;

    @Column(name = "total_chlorines")
    private Integer totalChlorines;

    @Column(name = "amount_fed")
    private Integer amountFed;

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
            this.cleanedDayCount =  java.time.Duration.between(lastCleanedAt, LocalDateTime.now()).toDays();
        }else this.cleanedDayCount = 0;
    }


    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        getDaysSinceLastCleaned();
    }
}
