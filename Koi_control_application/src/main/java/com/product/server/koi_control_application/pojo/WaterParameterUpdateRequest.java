package com.product.server.koi_control_application.pojo;


import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WaterParameterUpdateRequest {
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
    private Boolean lastCleaned;
}
