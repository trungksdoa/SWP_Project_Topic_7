package com.product.server.koi_control_application.pojo.momo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MomoPaymentResponseFail {
    private int resultCode;
    private String message;
    private long responseTime;
}
