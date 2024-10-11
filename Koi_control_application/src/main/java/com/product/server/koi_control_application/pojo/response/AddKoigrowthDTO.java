package com.product.server.koi_control_application.pojo.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddKoigrowthDTO {
    private LocalDate date;
    private Integer pondId;
    private BigDecimal weight;
    private BigDecimal length;
}



