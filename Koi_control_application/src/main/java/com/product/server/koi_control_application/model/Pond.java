package com.product.server.koi_control_application.model;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pond")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pond_name", nullable = false)
    private String name;

    private String imageUrl;
    private BigDecimal width;
    private BigDecimal length;
    private String deep;
    private BigDecimal volume;
    private Integer fishCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<KoiFish> koiFishes;

    @OneToMany(mappedBy = "pond", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<WaterParameter> waterParameters;
}
