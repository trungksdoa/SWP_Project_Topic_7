package com.product.server.koi_control_application.model;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "koi_fish")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String koiName;

    @Column(nullable = false)
    private String koiVariety;

    @Column(nullable = false)
    private Boolean koiSex;

    @Column(nullable = false)
    private BigDecimal purchasePrice;

    private String breeder;
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id")
    private Pond pond;
}