package com.product.server.koi_control_application.service_interface;


public interface PaymentProvider<T> {
    T createPayment();
    T handleCallback();
}