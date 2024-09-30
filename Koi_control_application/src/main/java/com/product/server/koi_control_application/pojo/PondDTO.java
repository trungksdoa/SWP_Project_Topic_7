package com.product.server.koi_control_application.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PondDTO {

    private String name;
    private BigDecimal width;
    private BigDecimal length;
    private BigDecimal depth;
    private int volume;


    private int fishCount;

    private int userId;
}
