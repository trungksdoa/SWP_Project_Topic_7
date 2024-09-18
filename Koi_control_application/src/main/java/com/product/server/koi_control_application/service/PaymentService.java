package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.config.VNPayConfig;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {
    private final VNPayConfig vnPayConfig;

    @Override
    public String createPayment(long amount, String orderCode, String orderType, String orderInfo) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = orderCode;
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = vnPayConfig.getVnpTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", null);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
//        vnp_Params.put("vnp_OrderInfo",)

        //Chỉnh lại múi gi hiện taại
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    public Map<String, String> processPaymentReturn(Map<String, String> vnpayParams) {
        Map<String, String> result = new HashMap<>();
        try {
            String vnp_SecureHash = vnpayParams.get("vnp_SecureHash");

            // Remove hash params
            vnpayParams.remove("vnp_SecureHash");
            vnpayParams.remove("vnp_SecureHashType");

            // Sorted params
            List<String> fieldNames = new ArrayList<>(vnpayParams.keySet());
            Collections.sort(fieldNames);

            // Create hash data and query
            StringBuilder hashData = new StringBuilder();
            for (String fieldName : fieldNames) {
                String fieldValue = vnpayParams.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                }
                if (fieldNames.indexOf(fieldName) < (fieldNames.size() - 1)) {
                    hashData.append('&');
                }
            }

            String signValue = VNPayConfig.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());

            if (signValue.equals(vnp_SecureHash)) {
                if ("00".equals(vnpayParams.get("vnp_ResponseCode"))) {
                    result.put("status", "success");
                    result.put("message", "Thanh toán thành công");
                } else {
                    result.put("status", "fail");
                    result.put("message", "Thanh toán thất bại");
                }
            } else {
                result.put("status", "invalid");
                result.put("message", "Chữ ký không hợp lệ");
            }
        } catch (UnsupportedEncodingException e) {
            result.put("status", "error");
            result.put("message", "Lỗi trong quá trình xử lý");
        }

        // Add additional payment info
        result.put("amount", vnpayParams.get("vnp_Amount"));
        result.put("orderInfo", vnpayParams.get("vnp_OrderInfo"));
        result.put("responseCode", vnpayParams.get("vnp_ResponseCode"));
        result.put("transactionNo", vnpayParams.get("vnp_TransactionNo"));
        result.put("bankCode", vnpayParams.get("vnp_BankCode"));
        result.put("payDate", vnpayParams.get("vnp_PayDate"));

        return result;
    }
}
