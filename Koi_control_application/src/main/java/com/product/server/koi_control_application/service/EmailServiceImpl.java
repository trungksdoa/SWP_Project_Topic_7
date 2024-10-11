package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.serviceInterface.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements IEmailService {
    private final JavaMailSender emailSender;

    @Override
    public void sendMail(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("trungvhse182490@fpt.edu.vn");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);

    }

    @Override
    public void sendPasswordToEmail(String email, String newPassword) {
        String subject = "From KOI Control Application (No reply)";
        String body = "Your new password is: " + newPassword + "\n\nPlease change this password after logging in.";
        sendMail(email, subject, body);
    }

}