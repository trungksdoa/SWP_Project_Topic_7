package com.product.server.koi_control_application.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class PondUpdateRequest {

    private String name;
    private String imageUrl;
    private BigDecimal width;
    private BigDecimal length;
    private BigDecimal depth;
    private int volume;
    private int fishCount;
    private int breeder;

}