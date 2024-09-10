package com.product.server.koi_control_application.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_parameter")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nitriteNO2;
    private Integer nitrateNO3;
    private Integer phosphatePO4;
    private Integer ammoniumNH4;
    private Integer hardnessGH;
    private Integer salt;
    private Integer outdoorTemperature;
    private Integer temperature;
    private Integer pH;
    private Integer carbonateHardnessKH;
    private Integer CO2;
    private Integer totalChlorines;
    private Integer amountFed;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id")
    private Pond pond;
}
