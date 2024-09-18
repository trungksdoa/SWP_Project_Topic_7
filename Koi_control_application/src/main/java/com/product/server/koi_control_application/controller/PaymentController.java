package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService vnPayService;

    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody Map<String, String> paymentInfo) throws UnsupportedEncodingException {
        String paymentUrl = vnPayService.createPayment(
                Long.parseLong(paymentInfo.get("amount")),
                paymentInfo.get("orderCode"),
                paymentInfo.get("orderType"),
                paymentInfo.get("orderInfo")
        );
        Map<String, String> response = new HashMap<>();
        response.put("code", "00");
        response.put("message", "success");
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/payment-return")
    public ResponseEntity<Map<String, String>> paymentReturn(HttpServletRequest request) {
        Map<String, String> vnpayParams = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();

      while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            vnpayParams.put(paramName, paramValue);
        }

        Map<String, String> paymentResult = vnPayService.processPaymentReturn(vnpayParams);
        return ResponseEntity.ok(paymentResult);
    }
}