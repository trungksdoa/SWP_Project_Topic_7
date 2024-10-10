package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;

import static com.product.server.koi_control_application.mappingInterface.PaymentStatusMappings.*;


@RestController
@RequestMapping(BASE_PAYMENT_STATUS)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

@Tag(name = "PaymentStatus", description = "API for PaymentStatus")
public class PaymentStatusController {
    private final IPaymentService paymentStatusService;
    private final JwtTokenUtil jwt;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> getAllPaymentStatus() {
        return ResponseUtil.createSuccessResponse(paymentStatusService.getAllPaymentStatus(), "Get all payment status successfully");
    }


    @DeleteMapping(CLEAR_PAYMENT_STATUS + '/')
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> clearPaymentStatus(@RequestParam LocalDateTime fromDate, @RequestParam LocalDateTime toDate) {
        paymentStatusService.clearPaymentStatusByDate(fromDate, toDate);
        return ResponseUtil.createSuccessResponse("OK", "Clear payment status successfully");
    }

    @GetMapping(GET_PAYMENT_STATUS)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> getPaymentStatus() {
        return ResponseUtil.createSuccessResponse(paymentStatusService.getAllPaymentInfo(), "Get payment status successfully");
    }


    @GetMapping(GET_PAYMENT_GATEWAY_URL + '/')
    @PreAuthorize("hasAnyRole('ROLE_ADMIN'," + "'ROLE_MEMBER'," + "'ROLE_SHOP')")
    public ResponseEntity<BaseResponse> getPaymentGatewayUrl(@RequestParam int orderId, HttpServletRequest request) {
        int userId = jwt.getUserIdFromToken(request);

        if (userId == -1) {
            return ResponseUtil.createResponse(null, "Unauthorized", HttpStatus.UNAUTHORIZED, null);
        }

        String url = paymentStatusService.getPaymentGatewayUrl(orderId, "product", userId);
        URI location = URI.create(url);
        return ResponseUtil.createResponse(url, "Get payment gateway url successfully", HttpStatus.FOUND, location);
    }
}
