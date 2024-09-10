package com.product.server.koi_control_application.model;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "koi_growth_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiGrowthHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "in_pond_from")
    private LocalDate inPondFrom;

    @Column(nullable = false)
    private BigDecimal weight;

    @Column(nullable = false)
    private Integer length;

    @Column(name = "is_first_measurement")
    private Boolean isFirstMeasurement;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "koi_id")
    private KoiFish koiFish;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id")
    private Pond pond;
}
