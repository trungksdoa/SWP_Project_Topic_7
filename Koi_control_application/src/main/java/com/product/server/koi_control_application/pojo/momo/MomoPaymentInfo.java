package com.product.server.koi_control_application.pojo.momo;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
public class MomoPaymentInfo {
    private String accessKey;
    private String secretKey;
    private String orderInfo;
    private String partnerCode;
    private String redirectUrl;
    private String ipnUrl;
    private String requestType;
    private Long amount;
    private String orderId;
    private String requestId;
    private String extraData;
    private String orderGroupId;
    private List<MomoProduct> items;
    private MomoUserInfo userInfo;
    private String lang;


    MomoPaymentInfo() {
    }

    MomoPaymentInfo(String accessKey, String secretKey, String orderInfo, String partnerCode, String redirectUrl, String ipnUrl, String requestType, Long amount, String orderId, String requestId, String extraData, String orderGroupId, List<MomoProduct> items, MomoUserInfo userInfo, String lang) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.orderInfo = orderInfo;
        this.partnerCode = partnerCode;
        this.redirectUrl = redirectUrl;
        this.ipnUrl = ipnUrl;
        this.requestType = requestType;
        this.amount = amount;
        this.orderId = orderId;
        this.requestId = requestId;
        this.extraData = extraData;
        this.orderGroupId = orderGroupId;
        this.items = items;
        this.userInfo = userInfo;
        this.lang = lang;
    }
}