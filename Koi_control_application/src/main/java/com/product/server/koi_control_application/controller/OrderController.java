package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.CheckOut;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class OrderController {

    private final IOrderService orderService;
    private final JwtTokenUtil jwtUtil;


    @PostMapping("/create")
    public ResponseEntity<BaseResponse> createOrder(@RequestBody CheckOut checkout, HttpServletRequest request) {

        int userId = jwtUtil.getUserIdFromToken(request);

        Orders createdOrder = orderService.createOrder(userId,checkout);
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
    public ResponseEntity<BaseResponse> cancelPendingOrderByUser(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelPendingOrder(userId, orderId);
        BaseResponse response = BaseResponse.builder()
                .data("The order has been cancelled")
                .statusCode(HttpStatus.OK.value())
                .message("User orders retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}/order/{orderId}/message/{message}")
    public ResponseEntity<BaseResponse> cancelOrderByAdmin(@PathVariable int userId, @PathVariable int orderId, @PathVariable String message) {
        orderService.cancelOrderByAdmin(userId, orderId, message);
        BaseResponse response = BaseResponse.builder()
                .data("The order has been cancelled")
                .statusCode(HttpStatus.OK.value())
                .message("Admin cancelled the order")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}