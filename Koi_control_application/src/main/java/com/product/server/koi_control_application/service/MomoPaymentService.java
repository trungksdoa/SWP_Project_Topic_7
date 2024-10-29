package com.product.server.koi_control_application.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.customException.TransactionException;
import com.product.server.koi_control_application.enums.PaymentType;
import com.product.server.koi_control_application.model.PaymentStatus;
import com.product.server.koi_control_application.pojo.momo.MomoCallbackResponse;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentResponse;
import com.product.server.koi_control_application.serviceHelper.interfaces.IMomoHelper;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.enums.PaymentCode.PENDING;

@Slf4j
@Service
@RequiredArgsConstructor
public class MomoPaymentService {
    private final IMomoHelper momoHelper;
    private final PaymentService paymentService;
    private final IOrderService orderService;

    @Transactional
    public ResponseEntity<MomoPaymentResponse> createPayment(MomoPaymentRequest request) throws Exception {
        JsonNode responseBody = momoHelper.createPayment(request).getBody();
        MomoPaymentResponse response = new ObjectMapper().convertValue(responseBody, MomoPaymentResponse.class);

        if (responseBody != null && responseBody.get("resultCode").asInt() != 0) {
            if (request.getOrderType().equals(PaymentType.PRODUCT.getValue())) {
                orderService.deleteOrder(Integer.parseInt(request.getOrderId()));
            }
            throw new TransactionException("Failed to create payment");
        }

        return processPayment(response, request);
    }

    private ResponseEntity<MomoPaymentResponse> processPayment(MomoPaymentResponse responseBody, MomoPaymentRequest request) {

        try {
            PaymentStatus paymentStatus = PaymentStatus.builder()
                    .userId(Integer.parseInt(request.getUserId()))
                    .referenceId(request.getOrderId())
                    .referenceType(request.getOrderType())
                    .paymentMethod("MOMO")
                    .momoOrderId(responseBody.getOrderId())
                    .paymentDescription("Pay with momo")
                    .build();

            if (responseBody.getResultCode() != 0) {
                paymentStatus.setPaymentStatus(FAILED.getValue());
                paymentStatus.setPaymentDescription(responseBody.getMessage());
            } else {
                paymentStatus.setPaymentStatus(PENDING.getValue());
                paymentStatus.setPaymentGatewayUrl(responseBody.getShortLink());
            }

            paymentService.createPaymentStatus(paymentStatus);
        } catch (Exception e) {
            throw new TransactionException("Failed to create payment status");
        }

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }


    public ResponseEntity<Void> momoCallback(MomoCallbackResponse callbackResponse) throws Exception {
        log.info("Getting callback from momo: {}", callbackResponse);
        momoHelper.momoCallback(callbackResponse);
        log.info("Processed done");

        return ResponseEntity.noContent().build();
    }

}
