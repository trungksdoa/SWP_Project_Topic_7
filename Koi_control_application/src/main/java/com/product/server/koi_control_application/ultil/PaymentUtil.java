package com.product.server.koi_control_application.ultil;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


public class PaymentUtil {

    private static final String MOMO_TEST_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";

    public static String PAYMENT_URL = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/create-momo-payment";
    public static String MOMO_REDIRECT_URL = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/redirect-momo-callback/";
    public static String MOMO_CALLBACK_URL = "https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/payment/callback";
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
