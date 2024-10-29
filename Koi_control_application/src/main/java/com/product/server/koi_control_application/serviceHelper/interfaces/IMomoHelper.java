package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.pojo.momo.MomoCallbackResponse;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentInfo;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;

public interface IMomoHelper {

    ResponseEntity<JsonNode> createPayment(MomoPaymentRequest request) throws Exception;
    String generateSignature(MomoPaymentInfo info) throws Exception;
    void momoCallback(MomoCallbackResponse momoCallbackResponse) throws Exception;
}
