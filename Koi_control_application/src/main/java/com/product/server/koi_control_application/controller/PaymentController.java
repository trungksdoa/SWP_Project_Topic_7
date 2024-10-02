package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.enums.ORDER;
import com.product.server.koi_control_application.enums.PAYMENT;
import com.product.server.koi_control_application.model.Payment;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.momo.*;
import com.product.server.koi_control_application.service_interface.ICartService;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.service_interface.IPaymentService;
import com.product.server.koi_control_application.service_interface.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

import static com.product.server.koi_control_application.enums.PAYMENT.FAILED;
import static com.product.server.koi_control_application.enums.PAYMENT.PAID;
import static com.product.server.koi_control_application.ultil.PaymentUtil.*;
import static com.product.server.koi_control_application.ultil.ResponseUtil.WEBSITE_URL;


@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "API for Payment")
public class PaymentController {
    private static final String HMAC_SHA256 = "HmacSHA256";
    private final IOrderService orderService;
    private final IUserService userService;
    private final ICartService cartService;
    private final IPaymentService paymentService;

    /*
     * Handle MoMo callback
     * @param callbackResponse: MoMo callback response
     * @return: Hello
     */
    @PostMapping("/callback")
    public String callback(@RequestBody MomoCallbackResponse callbackResponse) {
        log.info("Received MoMo callback: " + callbackResponse.toString());
        handleMomoCallback(callbackResponse);
        return "Hello";
    }

    /*
     * Create MoMo payment
     * @param mapData: MoMo payment request
     * @return: MoMo payment response
     * @throws Exception
     */
    @PostMapping("/create-momo-payment")
    public ResponseEntity<JsonNode> createMomoPayment(@RequestBody MomoPaymentRequest mapData) throws Exception {
        MomoPaymentInfo paymentInfo = getPaymentInfo(mapData);
        String rawSignature = createRawSignature(paymentInfo);
        String signature = hmacSHA256(rawSignature, paymentInfo.getSecretKey());

        if (mapData.getMomoProducts() == null || mapData.getMomoProducts().isEmpty()) {
            mapData.setMomoProducts(new ArrayList<>());
        }
        if (mapData.getMomoUserInfo() == null) {
            mapData.setMomoUserInfo(new MomoUserInfo());
        }



        Payment payment = Payment.builder()
                .referenceId(mapData.getOrderId())
                .referenceType(mapData.getOrderType())
                .paymentMethod("MOMO")
                .paymentDescription("Thanh toán qua MoMo")
                .paymentStatus(PAYMENT.PENDING.getValue())
                .build();

        paymentService.createPaymentStatus(payment);
        MomoRequestBody requestBody = createRequestBody(paymentInfo, signature);
        String jsonBody = new ObjectMapper().writeValueAsString(requestBody);

        HttpResponse<String> response = sendHttpRequest(jsonBody, MOMO_TEST_ENDPOINT);
        JsonNode responseBody = new ObjectMapper().readTree(response.body());

        logResponseDetails(response, responseBody);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    /*
     * Handle MoMo redirect
     * @param partnerCode: partner code
     * @param orderId: order id
     * @param requestId: request id
     * @param amount: amount
     * @param orderInfo: order info
     * @param orderType: order type
     */
    @GetMapping("/redirect-momo-callback/")
    public ResponseEntity<Void> handleMomoRedirect(@RequestParam("partnerCode") String partnerCode, @RequestParam("orderId") String orderId, @RequestParam("requestId") String requestId, @RequestParam("amount") String amount, @RequestParam("orderInfo") String orderInfo, @RequestParam("orderType") String orderType, @RequestParam("transId") String transId, @RequestParam("resultCode") String resultCode, @RequestParam("message") String message, @RequestParam("payType") String payType, @RequestParam("responseTime") String responseTime, @RequestParam("extraData") String extraData, @RequestParam("signature") String signature) {
        // Xử lý cập nhật trạng thái đơn hàng
        try {
            MomoCallbackResponse callbackResponse = new MomoCallbackResponse();
            callbackResponse.setOrderId(orderId);
            callbackResponse.setResultCode(Integer.parseInt(resultCode));
            callbackResponse.setMessage(message);
            callbackResponse.setTransId(Long.parseLong(transId));
            callbackResponse.setAmount(Long.parseLong(amount));
            callbackResponse.setResponseTime(Long.parseLong(responseTime));
            callbackResponse.setOrderInfo(orderInfo);
            callbackResponse.setPayType(payType);
            callbackResponse.setExtraData(extraData);
            callbackResponse.setSignature(signature);

            handleMomoCallback(callbackResponse);

            // Chuyển hướng người dùng đến trang kết quả thanh toán trên website của bạn
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("https://swp-project-topic-7.vercel.app/payment-success/?orderId=" + orderId + "&resultCode=" + resultCode + "&message=" + message + "&orderType=" + orderType)).build();
        } catch (Exception e) {
            if (e.getMessage().contains("Order has been canceled, you will be refunded soon")) {
                //Refund api
                return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(WEBSITE_URL + "error?message=Order has been canceled")).build();
            }
            // Xử lý lỗi và chuyển hướng đến trang lỗi
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(WEBSITE_URL + "error")).build();
        }
    }

    /**
     * Handles the MoMo callback response.
     * <p>
     * This method processes the callback response received from MoMo payment gateway.
     * It updates the order status based on the payment result and performs necessary actions
     * such as refunding the payment or updating the user's package.
     * </p>
     *
     * @param callbackResponse the MoMo callback response containing details of the payment transaction
     */
    private void handleMomoCallback(MomoCallbackResponse callbackResponse) {
        log.info("Received MoMo callback: " + callbackResponse.toString());

        // Split the orderId to extract orderId, orderType, and userId
        String[] orderIdParts = callbackResponse.getOrderId().split("-");
        String orderId = orderIdParts[0];
        String orderType = orderIdParts[1];
        String userId = orderIdParts[2];

        try {
            // Check if the payment was successful
            if (callbackResponse.getResultCode() == 0) {
                if (orderType.equals("product")) {
                    // If the order is already marked as paid, return
                    if (orderService.getOrderById(Integer.parseInt(orderId)).getStatus().equals(ORDER.SUCCESS.getValue())) {
                        return;
                    }

                    /*
                     * Update the payment status to PAID
                     */
                    paymentService.updatePaymentStatus(Integer.parseInt(orderId), orderType, PAID.getValue());


                    /*
                     * Update the order status to PAID
                     */
                    orderService.updateOrderStatus(Integer.parseInt(orderId), ORDER.SUCCESS.getValue());


                    /*
                     * Clear the cart
                     */
                    cartService.clearCart(Integer.parseInt(userId));
                    log.info("Order " + callbackResponse.getOrderId() + " has been paid successfully");
                } else {
                    // Handle package addition for the user
                    UserPackage userPackage = new UserPackage();
                    userPackage.setId(Integer.parseInt(orderId));

                    userService.addPackage(Integer.parseInt(userId), userPackage);
                    log.info("User " + userId + " has been added package successfully");
                }
            } else {
                // Handle failed payment
                if (orderType.equals("product")) {
                    orderService.updateOrderStatus(Integer.parseInt(orderId), ORDER.CANCELLED.getValue());
                    paymentService.updatePaymentStatus(Integer.parseInt(orderId), orderType, FAILED.getValue());
                    log.info("Order " + callbackResponse.getOrderId() + " has been canceled");
                } else {
                    paymentService.updatePaymentStatus(Integer.parseInt(orderId), orderType, FAILED.getValue());
                    log.info("User " + userId + " has not been added package yet");
                }
            }
        } catch (Exception ex) {
            // Log any errors that occur during the callback handling
            log.error("Error while handling MoMo callback: " + ex.getMessage());
        }
    }

    /*
     * Get payment info
     * @param request: payment request
     * @return: payment info
     */
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

    /*
     * Create a raw signature from the payment info
     * @param info: payment info
     * @return: raw signature
     */
    private String createRawSignature(MomoPaymentInfo info) {
        return String.format("accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s", info.getAccessKey(), info.getAmount(), info.getExtraData(), info.getIpnUrl(), info.getOrderId(), info.getOrderInfo(), info.getPartnerCode(), info.getRedirectUrl(), info.getRequestId(), info.getRequestType());
    }


    /*
     * Create a request body for the payment
     * @param momoPaymentInfo: payment info
     * @param signature: signature of the payment
     * @return: request body
     */
    private MomoRequestBody createRequestBody(MomoPaymentInfo momoPaymentInfo, String signature) {
        return MomoRequestBody.builder().partnerCode(momoPaymentInfo.getPartnerCode()).storeName("FPT WIFI LỎ").storeId("MomoTestStore").requestId(momoPaymentInfo.getRequestId()).amount(momoPaymentInfo.getAmount()).orderId(momoPaymentInfo.getOrderId()).orderInfo(momoPaymentInfo.getOrderInfo()).redirectUrl(momoPaymentInfo.getRedirectUrl()).ipnUrl(momoPaymentInfo.getIpnUrl()).lang(momoPaymentInfo.getLang()).requestType(momoPaymentInfo.getRequestType()).autoCapture(true).extraData(momoPaymentInfo.getExtraData()).orderGroupId(momoPaymentInfo.getOrderGroupId()).signature(signature).userInfo(momoPaymentInfo.getUserInfo()).items(momoPaymentInfo.getItems()).lang(momoPaymentInfo.getLang()).orderExpireTime(30).build();
    }


    /*
     * Log response details
     */
    private void logResponseDetails(HttpResponse<String> response, JsonNode responseBody) {
        log.info("Status: " + response.statusCode());
        log.info("Headers: " + response.headers());
        log.info("Body: " + response.body());
        log.info("resultCode: " + responseBody.get("resultCode"));
    }

    /*
     * Create HMAC SHA256 signature
     * @param data: data to sign
     * @param key: secret key
     * @return: signature
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     */
    private static String hmacSHA256(String data, String key) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256 = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
        sha256.init(secretKey);
        byte[] hash = sha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }


    /*
     * Convert bytes to hex
     * @param hash: bytes to convert
     * @return: hex string
     */
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