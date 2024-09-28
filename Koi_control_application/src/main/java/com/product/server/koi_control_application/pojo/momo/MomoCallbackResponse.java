package com.product.server.koi_control_application.pojo.momo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MomoCallbackResponse {
    private String orderType;      // Loại đơn hàng
    private Long amount;           // Số tiền
    private String partnerCode;    // Mã đối tác
    private String orderId;        // ID đơn hàng
    private String extraData;      // Dữ liệu bổ sung
    private String signature;      // Chữ ký
    private Long transId;          // ID giao dịch
    private Long responseTime;     // Thời gian phản hồi
    private Integer resultCode;    // Mã kết quả
    private String message;        // Thông điệp
    private String payType;        // Phương thức thanh toán
    private String requestId;      // ID yêu cầu
    private String orderInfo;      // Thông tin đơn hàng
}