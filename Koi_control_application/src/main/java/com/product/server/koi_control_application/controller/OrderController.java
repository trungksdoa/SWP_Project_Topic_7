package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.dto.BaseResponse;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final IOrderService orderService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> createOrder(@PathVariable int userId) {
        Orders createdOrder = orderService.createOrder(userId);
        BaseResponse response = BaseResponse.builder()
                .data(createdOrder)
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

    @PutMapping("/{id}/status")
    public ResponseEntity<BaseResponse> updateOrderStatus(@PathVariable int id, @RequestParam String status) {
        Orders updatedOrder = orderService.updateOrderStatus(id, status);
        BaseResponse response = BaseResponse.builder()
                .data(updatedOrder)
                .statusCode(HttpStatus.OK.value())
                .message("Order status updated successfully")
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
    public ResponseEntity<BaseResponse> cancelOrder(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelOrder(userId, orderId);
        BaseResponse response = BaseResponse.builder()
                .data("The order has been cancelled")
                .statusCode(HttpStatus.OK.value())
                .message("User orders retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}