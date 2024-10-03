package com.product.server.koi_control_application.pojo;


import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KoiFishDTO {
    private String name;
    private String variety;
    private Boolean sex;
    private int purchasePrice;
    private Integer userId;

    private Integer pondId;
    private BigDecimal weight;
    private BigDecimal length;
}
