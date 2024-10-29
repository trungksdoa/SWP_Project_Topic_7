package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.momo.*;
import com.product.server.koi_control_application.service.MomoPaymentService;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
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
import java.util.HashMap;
import java.util.Map;

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.enums.PaymentCode.PAID;
import static com.product.server.koi_control_application.mappingInterface.PaymentMappings.*;
import static com.product.server.koi_control_application.ultil.PaymentUtil.*;
import static com.product.server.koi_control_application.ultil.ResponseUtil.WEBSITE_URL;


@RestController
@RequestMapping(BASE_PAYMENT)
@RequiredArgsConstructor
@Slf4j
@Tag(name = "PaymentStatus", description = "API for PaymentStatus")
public class PaymentController {
    private static final String HMAC_SHA256 = "HmacSHA256";
    private final IOrderService orderService;
    private final IUserService userService;
    private final ICartService cartService;
    private final IPaymentService paymentService;
    private final MomoPaymentService momoPaymentService;

    /*
     * Handle MoMo callback
     * @param callbackResponse: MoMo callback response
     * @return: Hello
     */
    @PostMapping(MOMO_CALLBACK)
    public ResponseEntity<Void> callback(@RequestBody MomoCallbackResponse callbackResponse) throws Exception {
        return momoPaymentService.momoCallback(callbackResponse);
    }

//    @GetMapping(MOMO_CHECKING_STATUS)
//    public ResponseEntity<JsonNode> checkOrderStatus(@PathVariable String orderId) throws Exception {
//        // Create signature for the request
//        String requestId = String.valueOf(System.currentTimeMillis());
//        String rawSignature = String.format("accessKey=%s&orderId=%s&partnerCode=%s&requestId=%s",
//                accessKey, orderId, partnerCode, requestId);
//        String signature = hmacSHA256(rawSignature, secretKey);
//
//        // Create request body
//        Map<String, String> requestBody = new HashMap<>();
//        requestBody.put("partnerCode", partnerCode);
//        requestBody.put("requestId", requestId);
//        requestBody.put("orderId", orderId);
//        requestBody.put("lang", "en");
//        requestBody.put("signature", signature);
//
//        String jsonBody = new ObjectMapper().writeValueAsString(requestBody);
//
//        // Send request to MoMo
//        HttpResponse<String> response = sendHttpRequest(jsonBody, MOMO_QUERY_STATUS_ENDPOINT);
//        //Fix it
//        JsonNode responseBody = new ObjectMapper().readTree(response.body());
//
//        //Mapping JsonNode to MomoCallbackResponse
//        MomoCallbackResponse callbackResponse = new ObjectMapper().readValue(responseBody.toString(), MomoCallbackResponse.class);
//        handleMomoCallback(callbackResponse);
//
//        // Log the response
//        logResponseDetails(response, responseBody);
//
//        return new ResponseEntity<>(responseBody, HttpStatus.OK);
//    }

    /*
     * Create MoMo payment
     * @param mapData: MoMo payment request
     * @return: MoMo payment response
     * @throws Exception
     */
    @PostMapping(CREATE_MOMO_PAYMENT)
    public ResponseEntity<MomoPaymentResponse> createMomoPayment(@RequestBody MomoPaymentRequest mapData) throws Exception {
        return momoPaymentService.createPayment(mapData);
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
    @GetMapping(MOMO_REDIRECT)
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

            momoPaymentService.momoCallback(callbackResponse);

            // Chuyển hướng người dùng đến trang kết quả thanh toán trên website của bạn
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(WEBSITE_URL + "/payment-success/?orderId=" + orderId + "&resultCode=" + resultCode + "&message=" + message + "&orderType=" + orderType)).build();
        } catch (Exception e) {
            // Xử lý lỗi và chuyển hướng đến trang lỗi
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(WEBSITE_URL + "error")).build();
        }
    }

}