package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.pojo.PaymentStatus;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface IPaymentService {
    String createPayment(long amount, String orderType, String orderInfo) throws UnsupportedEncodingException;


    PaymentStatus processPaymentReturn(Map<String, String> vnpayParams);

}
