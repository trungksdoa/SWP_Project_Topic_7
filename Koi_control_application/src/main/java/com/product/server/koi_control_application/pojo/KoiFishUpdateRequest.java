package com.product.server.koi_control_application.pojo;


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
public class KoiFishUpdateRequest {
    private String name;
    private String variety;
    private Boolean sex;
    private Integer purchasePrice;
    private LocalDate date;
    private Integer pondId;
    private BigDecimal weight;
    private BigDecimal length;
    private LocalDate dateOfBirth;
    private Double ageMonth;
    private Boolean isNew;

}
