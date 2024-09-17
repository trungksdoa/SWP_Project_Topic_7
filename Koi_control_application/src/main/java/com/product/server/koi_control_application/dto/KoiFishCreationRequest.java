package com.product.server.koi_control_application.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class KoiFishCreationRequest {
    private String name;
    private String variety;
    private Boolean sex;
    private int purchasePrice;
    private String breeder;
    private String imageUrl;
    private int pondId;
}
