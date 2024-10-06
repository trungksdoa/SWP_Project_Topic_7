package com.product.server.koi_control_application.pojo;


import jakarta.annotation.Nullable;
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
public class KoiFishDTO {
    private String name;
    private String variety;
    private Boolean sex;
    private Integer purchasePrice;
    private Integer userId;
    private LocalDate dateOfBirth;
    private LocalDate date;
    private LocalDate ageMonth;
    private Integer pondId;
    private BigDecimal weight;
    private BigDecimal length;
}
