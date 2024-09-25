package com.product.server.koi_control_application.pojo.momo;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
public class MomoRequestBody  extends MomoPaymentInfo{
    private String storeId;
    private boolean autoCapture;
    private String signature;
    private String storeName;
    MomoRequestBody(String accessKey, String secretKey, String orderInfo, String partnerCode, String redirectUrl, String ipnUrl, String requestType, String amount, String orderId, String requestId, String extraData, String orderGroupId, List<MomoProduct> items, MomoUserInfo userInfo, String lang) {
        super(accessKey, secretKey, orderInfo, partnerCode, redirectUrl, ipnUrl, requestType, amount, orderId, requestId, extraData, orderGroupId, items, userInfo, lang);
    }
    //
}
