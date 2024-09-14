package com.product.server.koi_control_application.service;

public interface IEmailService  {
    void sendMail( String to, String subject, String text);
}
