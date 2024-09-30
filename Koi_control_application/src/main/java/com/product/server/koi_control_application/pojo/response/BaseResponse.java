package com.product.server.koi_control_application.pojo.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseResponse {
    private String message;
    private int statusCode;
    private Object data;
}
