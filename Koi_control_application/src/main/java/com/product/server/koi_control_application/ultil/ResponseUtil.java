package com.product.server.koi_control_application.ultil;

import com.product.server.koi_control_application.pojo.BaseResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;

public class ResponseUtil {

    public static String WEBSITE_URL = "https://swp-project-topic-7.vercel.app/";

    public static ResponseEntity<BaseResponse> createResponse(Object data, String message, HttpStatus status) {
        return new ResponseEntity<>(BaseResponse.builder()
                .data(data)
                .message(message)
                .statusCode(status.value())
                .build(), status);
    }

    public static ResponseEntity<BaseResponse> createResponse(Object data, String message, HttpStatus status, URI location) {
        BaseResponse response = BaseResponse.builder()
                .data(data)
                .message(message)
                .statusCode(status.value())
                .build();

        HttpHeaders headers = new HttpHeaders();
        if (location != null) {
            headers.setLocation(location);
        }

        return new ResponseEntity<>(response, headers, status);
    }


    public static ResponseEntity<BaseResponse> createSuccessResponse(Object data, String message) {
        return createResponse(data, message, HttpStatus.OK);
    }

    public static ResponseEntity<BaseResponse> createErrorResponse(String message, HttpStatus status) {
        return createResponse(null, message, status);
    }
}