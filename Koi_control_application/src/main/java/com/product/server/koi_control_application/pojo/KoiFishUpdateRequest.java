package com.product.server.koi_control_application.pojo;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class KoiFishUpdateRequest {
    private String name;
    private String variety;
    private Boolean sex;
    private Integer purchasePrice;
    private Integer userId;
    private String imageUrl;
    private Integer pondId;
    private Integer weight;
    private Integer length;
    private LocalDate date;

}
