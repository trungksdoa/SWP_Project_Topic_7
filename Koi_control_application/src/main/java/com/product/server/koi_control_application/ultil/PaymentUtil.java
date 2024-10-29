package com.product.server.koi_control_application.ultil;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


public class PaymentUtil {

    public static final String MOMO_QUERY_STATUS_ENDPOINT= "https://test-payment.momo.vn/v2/gateway/api/query";
    public static final String MOMO_TEST_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
//    public static String PAYMENT_URL = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/create-momo-payment";
    public static final  String PAYMENT_URL = "https://5d0e-171-240-137-153.ngrok-free.app/api/payment/create-momo-payment";

    //Update later
    public static final String accessKey = "F8BBA842ECF85";
    public static final String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    public static final String partnerCode = "MOMO";
//    public static String redirectUrl = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/redirect-momo-callback/";
//    public static String ifnUrl = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/callback";
    public static final String redirectUrl = "https://5d0e-171-240-137-153.ngrok-free.app/api/payment/redirect-momo-callback/";
    public static final String ifnUrl = "https://5d0e-171-240-137-153.ngrok-free.app/api/payment/callback";
    public static final String requestType = "payWithMethod";

    public static HttpResponse<String> sendHttpRequest(String jsonBody, String URL) throws Exception {
        HttpClient client = HttpClient.newBuilder().build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(URL))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }


}
