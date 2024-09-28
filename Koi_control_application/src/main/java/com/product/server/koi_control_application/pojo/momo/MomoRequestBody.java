package com.product.server.koi_control_application.pojo.momo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
public class MomoRequestBody  extends MomoPaymentInfo{
    private String storeId;
    private boolean autoCapture;
    private String signature;
    private String storeName;
    private int orderExpireTime;

    //
}
