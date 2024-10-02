package com.product.server.koi_control_application.controller;



import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service_interface.IPaymentService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/manage/api/paymentStatus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "PaymentStatus", description = "API for PaymentStatus")
public class PaymentStatusController {
    private final IPaymentService paymentStatusService;


    @GetMapping()
    public ResponseEntity<BaseResponse> getAllPaymentStatus() {
        return ResponseUtil.createSuccessResponse(paymentStatusService.getAllPaymentStatus(),"Get all payment status successfully");
    }


    @DeleteMapping("/clear-payment-status")
    public ResponseEntity<BaseResponse> clearPaymentStatus(@RequestParam LocalDateTime fromDate, @RequestParam LocalDateTime toDate) {
        paymentStatusService.clearPaymentStatusByDate(fromDate, toDate);
        return ResponseUtil.createSuccessResponse("OK","Clear payment status successfully");
    }
}
