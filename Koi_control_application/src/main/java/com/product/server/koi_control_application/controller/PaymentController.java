package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.momo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private static final String MOMO_TEST_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
    private static final String HMAC_SHA256 = "HmacSHA256";

    @PostMapping("/create-momo-payment")
    public ResponseEntity<JsonNode> createMomoPayment(@RequestBody MomoPaymentRequest mapData) throws Exception {
        MomoPaymentInfo paymentInfo = getPaymentInfo(mapData);
        String rawSignature = createRawSignature(paymentInfo);
        String signature = hmacSHA256(rawSignature, paymentInfo.getSecretKey());

        if (mapData.getMomoProducts().isEmpty()) {
            mapData.setMomoProducts(new ArrayList<>());
        }
        if (mapData.getMomoUserInfo() == null) {
            mapData.setMomoUserInfo(new MomoUserInfo());
        }

        MomoRequestBody requestBody = createRequestBody(paymentInfo, signature);
        String jsonBody = new ObjectMapper().writeValueAsString(requestBody);

        HttpResponse<String> response = sendHttpRequest(jsonBody);
        JsonNode responseBody = new ObjectMapper().readTree(response.body());

        logResponseDetails(response, responseBody);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }


    private MomoPaymentInfo getPaymentInfo(MomoPaymentRequest request) {
        String accessKey = "F8BBA842ECF85";
        String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        String partnerCode = "MOMO";
        String redirectUrl = "https://swp-project-topic-7.vercel.app";
        String ifnUrl = "https://swp-project-topic-7.vercel.app";
        String requestType = "payWithMethod";
        return MomoPaymentInfo.builder()
                .accessKey(accessKey)
                .secretKey(secretKey)
                .orderInfo(request.getOrderInfo())
                .partnerCode(partnerCode)
                .redirectUrl(redirectUrl)
                .ipnUrl(ifnUrl)
                .requestType(requestType)
                .amount(request.getAmount())
                .orderId(request.getOrderId() + "-" + System.currentTimeMillis())
                //As milliseconds is unique, requestId is set to current time in milliseconds
                .requestId(request.getRequestId() + "-" + System.currentTimeMillis())
                .extraData("")
                .orderGroupId("")
                .items(request.getMomoProducts())
                .userInfo(request.getMomoUserInfo())
                .lang("en")
                .build();
    }

    /*
     * Create a raw signature from the payment info
     * @param info: payment info
     * @return: raw signature
     */
    private String createRawSignature(MomoPaymentInfo info) {
        return String.format("accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                info.getAccessKey(), info.getAmount(), info.getExtraData(), info.getIpnUrl(), info.getOrderId(),
                info.getOrderInfo(), info.getPartnerCode(), info.getRedirectUrl(), info.getRequestId(), info.getRequestType());
    }

    /*
     * Create a request body for the payment
     * @param momoPaymentInfo: payment info
     * @param signature: signature of the payment
     * @return: request body
     */
    private MomoRequestBody createRequestBody(MomoPaymentInfo momoPaymentInfo, String signature) {
        return MomoRequestBody.builder()
                .partnerCode(momoPaymentInfo.getPartnerCode())
                .storeName("FPT WIFI LỎ")
                .storeId("MomoTestStore")
                .requestId(momoPaymentInfo.getRequestId())
                .amount(momoPaymentInfo.getAmount())
                .orderId(momoPaymentInfo.getOrderId())
                .orderInfo(momoPaymentInfo.getOrderInfo())
                .redirectUrl(momoPaymentInfo.getRedirectUrl())
                .ipnUrl(momoPaymentInfo.getIpnUrl())
                .lang(momoPaymentInfo.getLang())
                .requestType(momoPaymentInfo.getRequestType())
                .autoCapture(true)
                .extraData(momoPaymentInfo.getExtraData())
                .orderGroupId(momoPaymentInfo.getOrderGroupId())
                .signature(signature)
                .userInfo(momoPaymentInfo.getUserInfo())
                .items(momoPaymentInfo.getItems())
                .lang(momoPaymentInfo.getLang())
                .build();
    }

    @PostMapping("/momo-callback")
    public ResponseEntity<BaseResponse> handleMomoCallback(@RequestBody MomoCallbackResponse callbackResponse) {
        // Xử lý callback từ MoMo
        log.info("Received MoMo callback: " + callbackResponse);

        // Kiểm tra trạng thái đơn hàng
        if(callbackResponse.getResultCode() == 0) {
            // Đơn hàng đã được thanh toán thành công
            // Thực hiện cập nhật trạng thái đơn hàng trong hệ thống
            log.info("Order " + callbackResponse.getOrderId() + " has been paid successfully");
        } else {
            // Đơn hàng chưa được thanh toán
            // Thực hiện xử lý tùy ý
            log.info("Order " + callbackResponse.getOrderId() + " has not been paid yet");
        }

        // Trả về phản hồi cho MoMo
        return new ResponseEntity<>(BaseResponse.builder()
                .data(callbackResponse)
                .statusCode(HttpStatus.OK.value())
                .message("Callback processed successfully")
                .build(), HttpStatus.OK);
    }

    private HttpResponse<String> sendHttpRequest(String jsonBody) throws Exception {
        HttpClient client = HttpClient.newBuilder().build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(MOMO_TEST_ENDPOINT))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private void logResponseDetails(HttpResponse<String> response, JsonNode responseBody) {
        log.info("Status: " + response.statusCode());
        log.info("Headers: " + response.headers());
        log.info("Body: " + response.body());
        log.info("resultCode: " + responseBody.get("resultCode"));
    }

    private static String hmacSHA256(String data, String key) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256 = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
        sha256.init(secretKey);
        byte[] hash = sha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}