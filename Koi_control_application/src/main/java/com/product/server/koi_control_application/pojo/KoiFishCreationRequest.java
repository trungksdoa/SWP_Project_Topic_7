package com.product.server.koi_control_application.pojo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class KoiFishCreationRequest {
    private String name;
    private String variety;
    private Boolean sex;
    private Integer purchasePrice;
    private String userId;
    private String imageUrl;
    private Integer pondId;
}
