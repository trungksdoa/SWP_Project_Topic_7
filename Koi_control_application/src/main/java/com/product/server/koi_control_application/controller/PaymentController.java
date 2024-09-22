package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.service_interface.IPaymentService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@RolesAllowed({ "ROLE_MEMBER", "ROLE_SHOP" })
public class PaymentController {

    private final IPaymentService vnPayService;


    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody Map<String, String> paymentInfo) throws UnsupportedEncodingException {
        String paymentUrl = vnPayService.createPayment(
                Long.parseLong(paymentInfo.get("amount")),
                paymentInfo.get("orderType"),
                paymentInfo.get("orderInfo")
        );
        Map<String, String> response = new HashMap<>();
        response.put("code", "00");
        response.put("message", "success");
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }


}