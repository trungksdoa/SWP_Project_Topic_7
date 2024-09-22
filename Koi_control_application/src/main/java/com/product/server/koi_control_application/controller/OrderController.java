package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.CheckOut;
import com.product.server.koi_control_application.pojo.PaymentStatus;
import com.product.server.koi_control_application.service.SSEService;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.service_interface.IPaymentService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.OrderInfoUtil;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class OrderController {

    private final IOrderService orderService;
    private final JwtTokenUtil jwtUtil;
    private final PaymentController paymentController;
    private final IPaymentService vnPayService;
    private final SSEService<BaseResponse> sseService;

    @PostMapping("/create")
    public ResponseEntity<BaseResponse> createOrder(@RequestBody CheckOut checkout, HttpServletRequest request) throws UnsupportedEncodingException {

        int userId = jwtUtil.getUserIdFromToken(request);

        Orders createdOrder = orderService.createOrder(userId, checkout);

        Map<String, String> data = new HashMap<>();

        data.put("orderCode", String.valueOf(createdOrder.getId()));
        data.put("orderType", "payment");
        data.put("orderInfo", "OrderId: " + createdOrder.getId());
        data.put("amount", String.valueOf(createdOrder.getTotalAmount()));


        ResponseEntity<Map<String, String>> map = paymentController.createPayment(data);

        BaseResponse response = BaseResponse.builder()
                .data(map.getBody())
                .statusCode(HttpStatus.CREATED.value())
                .message("Order created successfully")
                .build();


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/payment-return")
    public ResponseEntity<Void> paymentReturn(HttpServletRequest request) {
        Map<String, String> vnpayParams = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        int statusCode = HttpStatus.OK.value();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            vnpayParams.put(paramName, paramValue);
        }

        PaymentStatus paymentResult = vnPayService.processPaymentReturn(vnpayParams);
        OrderInfoUtil ultils = new OrderInfoUtil();
        Optional<Integer> orderIdOpt = ultils.extractOrderId(paymentResult.getOrderInfo());

        if (orderIdOpt.isPresent()) {
            int orderId = orderIdOpt.get();
            if (!Objects.equals(paymentResult.getStatus(), "00")) {
                orderService.cancelOrderByAdmin(orderId, "Cancel by admin: Payment failed");
                statusCode = HttpStatus.OK.value();
            }
        } else {
            statusCode = HttpStatus.BAD_REQUEST.value();
        }

        BaseResponse response = BaseResponse.builder()
                .data(paymentResult)
                .statusCode(statusCode)
                .message(paymentResult.getMessage())
                .build();

        sseService.emitEvent(response);


        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "https://google.com.vn")
                .build();
    }

    @GetMapping
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

    @GetMapping("/user/{userId}/page/{page}/size/{size}")
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId, @PathVariable int page,
                                                           @PathVariable int size) {
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

//    @PutMapping("/{id}/status")
//    public ResponseEntity<BaseResponse> updateOrderStatus(@PathVariable int id, @RequestParam String status) {
//        Orders updatedOrder = orderService.updateOrderStatus(id, status);
//        BaseResponse response = BaseResponse.builder()
//                .data(updatedOrder)
//                .statusCode(HttpStatus.OK.value())
//                .message("Order status updated successfully")
//                .build();
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

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