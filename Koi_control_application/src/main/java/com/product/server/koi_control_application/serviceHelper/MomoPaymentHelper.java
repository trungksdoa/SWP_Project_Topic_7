package com.product.server.koi_control_application.serviceHelper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.enums.PaymentType;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.momo.MomoCallbackResponse;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentInfo;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.product.server.koi_control_application.pojo.momo.MomoRequestBody;
import com.product.server.koi_control_application.service.PaymentProcessor;
import com.product.server.koi_control_application.serviceHelper.interfaces.IMomoHelper;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.PaymentUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.enums.PaymentCode.PAID;
import static com.product.server.koi_control_application.ultil.PaymentUtil.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoPaymentHelper implements IMomoHelper {
    private static final String HMAC_SHA256 = "HmacSHA256";
    private final IOrderService orderService;
    private final IUserService userService;
    private final ICartService cartService;
    private final IPaymentService paymentService;

    @Override
    public ResponseEntity<JsonNode> createPayment(MomoPaymentRequest request) throws Exception {
        MomoPaymentInfo paymentInfo = getPaymentInfo(request);
        String signature = generateSignature(paymentInfo);
        MomoRequestBody requestBody = createRequestBody(paymentInfo, signature);

        return processPaymentRequest(requestBody, request);
    }

    private ResponseEntity<JsonNode> processPaymentRequest(MomoRequestBody requestBody, MomoPaymentRequest request) {
        try {
            String jsonBody = new ObjectMapper().writeValueAsString(requestBody);
            HttpResponse<String> response = PaymentUtil.sendHttpRequest(jsonBody, MOMO_TEST_ENDPOINT);
            JsonNode responseBody = new ObjectMapper().readTree(response.body());
            logResponseDetails(response, responseBody);
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Override
    public String generateSignature(MomoPaymentInfo info) throws Exception {
        String rawSignature = createRawSignature(info);
        return hmacSHA256(rawSignature, info.getSecretKey());
    }

    @Override
    public void momoCallback(MomoCallbackResponse momoCallbackResponse) throws Exception {
        PaymentProcessor processor = new PaymentProcessor(
                orderService,
                userService,
                cartService,
                paymentService
        );
        processor.processCallback(momoCallbackResponse);
    }



    private MomoPaymentInfo getPaymentInfo(MomoPaymentRequest request) {
        return MomoPaymentInfo.builder().accessKey(accessKey).secretKey(secretKey)
                .orderInfo(request.getOrderInfo())
                .partnerCode(partnerCode)
                .redirectUrl(redirectUrl)
                .ipnUrl(ifnUrl)
                .requestType(requestType)
                .amount(request.getAmount())
                .orderId(request.getOrderId() + "-" + request.getOrderType() + "-" + request.getUserId() + "-" + System.currentTimeMillis()).requestId(System.currentTimeMillis() + "").extraData("").orderGroupId("").items(request.getMomoProducts()).userInfo(request.getMomoUserInfo()).lang("en").orderExpireTime(30).build();
    }

    private String createRawSignature(MomoPaymentInfo info) {
        return String.format("accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s", info.getAccessKey(), info.getAmount(), info.getExtraData(), info.getIpnUrl(), info.getOrderId(), info.getOrderInfo(), info.getPartnerCode(), info.getRedirectUrl(), info.getRequestId(), info.getRequestType());
    }

    private MomoRequestBody createRequestBody(MomoPaymentInfo momoPaymentInfo, String signature) {
        return MomoRequestBody.builder().partnerCode(momoPaymentInfo.getPartnerCode()).storeName("FPT WIFI LỎ").storeId("MomoTestStore").requestId(momoPaymentInfo.getRequestId()).amount(momoPaymentInfo.getAmount()).orderId(momoPaymentInfo.getOrderId()).orderInfo(momoPaymentInfo.getOrderInfo()).redirectUrl(momoPaymentInfo.getRedirectUrl()).ipnUrl(momoPaymentInfo.getIpnUrl()).lang(momoPaymentInfo.getLang()).requestType(momoPaymentInfo.getRequestType()).autoCapture(true).extraData(momoPaymentInfo.getExtraData()).orderGroupId(momoPaymentInfo.getOrderGroupId()).signature(signature).userInfo(momoPaymentInfo.getUserInfo()).items(momoPaymentInfo.getItems()).lang(momoPaymentInfo.getLang()).orderExpireTime(30).build();
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