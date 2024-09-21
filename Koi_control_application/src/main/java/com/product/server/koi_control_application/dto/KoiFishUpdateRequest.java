package com.product.server.koi_control_application.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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
}
