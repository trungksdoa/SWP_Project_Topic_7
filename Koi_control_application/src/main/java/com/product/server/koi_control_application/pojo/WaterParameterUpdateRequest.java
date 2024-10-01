package com.product.server.koi_control_application.pojo;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WaterParameterUpdateRequest {
    private Integer nitriteNO2;
    private Integer nitrateNO3;
    private Integer ammoniumNH4;
    private Integer hardnessGH;
    private Integer salt;
    private Integer temperature;
    private Integer pH;
    private Integer carbonateHardnessKH;
    private Integer co2;
    private Integer totalChlorines;
    private Integer amountFed;
    private Boolean lastCleaned;
}
