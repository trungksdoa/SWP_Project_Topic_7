package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.OrderProductRequest;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class OrderController {

    private final IOrderService orderService;
    private final JwtTokenUtil jwtUtil;


    @PostMapping("/create-product-order")
    public ResponseEntity<BaseResponse> createOrder(@RequestBody OrderProductRequest req, HttpServletRequest request)  {

        int userId = jwtUtil.getUserIdFromToken(request);

//        Orders createdOrder = orderService.createOrder(userId, req);

        BaseResponse response = BaseResponse.builder()
                .data("")
                .statusCode(HttpStatus.CREATED.value())
                .message("Order created successfully")
                .build();


        return new ResponseEntity<>(response, HttpStatus.CREATED);
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