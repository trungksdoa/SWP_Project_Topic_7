package com.product.server.koi_control_application.serviceInterface;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface IPaymentService {
    String createPayment(long amount, String orderCode, String orderType, String orderInfo) throws UnsupportedEncodingException;


    Map<String, String> processPaymentReturn(Map<String, String> vnpayParams);

}
