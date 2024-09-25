package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.*;
import com.product.server.koi_control_application.service.SSEService;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class OrderController {

    private final IOrderService orderService;
    private final JwtTokenUtil jwtUtil;
    private final PaymentController paymentController;
    private final SSEService<BaseResponse> sseService;
//    private final ZaloPayService zaloPayService;

    @PostMapping("/create-product-order")
    public ResponseEntity<BaseResponse> createOrder(@RequestBody OrderProductRequest req, HttpServletRequest request) throws JSONException, JsonProcessingException {

        int userId = jwtUtil.getUserIdFromToken(request);

        Orders createdOrder = orderService.createOrder(userId, req);

        long amount = createdOrder.getTotalAmount();
        String description = "Payment for order #orderId:" + createdOrder.getId();

        EmbedData embedData = new EmbedData();

        String data = "{\"user_id\": " + userId + ", \"order_id\": " + createdOrder.getId() + "}";
        embedData.setMerchantinfo(data);
//        ZaloResponse res = zaloPayService.createProductOrder(createdOrder, amount, description, embedData);


        BaseResponse response = BaseResponse.builder()
                .data("")
                .statusCode(HttpStatus.CREATED.value())
                .message("Order created successfully")
                .build();


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


//    @GetMapping("/payment-return")
//    public ResponseEntity<Void> paymentReturn(HttpServletRequest request) {
//        Map<String, String> vnpayParams = new HashMap<>();
//        Enumeration<String> paramNames = request.getParameterNames();
//        int statusCode = HttpStatus.OK.value();
//        while (paramNames.hasMoreElements()) {
//            String paramName = paramNames.nextElement();
//            String paramValue = request.getParameter(paramName);
//            vnpayParams.put(paramName, paramValue);
//        }
//
////        PaymentStatus paymentResult = vnPayService.processPaymentReturn(vnpayParams);
//        OrderInfoUtil ultils = new OrderInfoUtil();
////        Optional<Integer> orderIdOpt = ultils.extractOrderId(paymentResult.getOrderInfo());
////
////        if (orderIdOpt.isPresent()) {
////            int orderId = orderIdOpt.get();
////            if (!Objects.equals(paymentResult.getStatus(), "00")) {
////                orderService.cancelOrderByAdmin(orderId, "Cancel by admin: Payment failed");
////                statusCode = HttpStatus.OK.value();
////            }
////        } else {
////            statusCode = HttpStatus.BAD_REQUEST.value();
////        }
//
//        BaseResponse response = BaseResponse.builder()
//                .data("")
//                .statusCode(statusCode)
//                .message("")
//                .build();
//
//        sseService.emitEvent(response);
//
//
//        return ResponseEntity.status(HttpStatus.FOUND)
//                .header("Location", "https://youtube.com")
//                .build();
//    }


    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> test() {
        BaseResponse response = BaseResponse.builder()
                .data(orderService.getAllOrders())
                .statusCode(HttpStatus.OK.value())
                .message("Test")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getOrder(@PathVariable int id) {
        Orders order = orderService.getOrderById(id);
        BaseResponse response = BaseResponse.builder()
                .data(order)
                .statusCode(HttpStatus.OK.value())
                .message("Order retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/")
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId, @RequestParam int page, @RequestParam int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        BaseResponse response = BaseResponse.builder()
                .data(orders)
                .statusCode(HttpStatus.OK.value())
                .message("Orders retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<BaseResponse> getOrderStatus(@PathVariable int orderId) {
        Orders order = orderService.getOrderById(orderId);

        Map<String, String> map = new HashMap<>();
        map.put("status", order.getStatus());
        BaseResponse response = BaseResponse.builder()
                .data(map)
                .statusCode(HttpStatus.OK.value())
                .message("Return order status successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> getOrdersByUser(@PathVariable int userId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        BaseResponse response = BaseResponse.builder()
                .data(orders)
                .statusCode(HttpStatus.OK.value())
                .message("User orders retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}/order/{orderId}")
    public ResponseEntity<BaseResponse> cancelPendingOrderByUser(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelPendingOrder(userId, orderId);
        BaseResponse response = BaseResponse.builder()
                .data("The order has been cancelled")
                .statusCode(HttpStatus.OK.value())
                .message("User orders retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}