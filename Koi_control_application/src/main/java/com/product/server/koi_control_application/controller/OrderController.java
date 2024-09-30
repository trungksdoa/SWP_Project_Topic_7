package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.request.OrderProductDTO;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.product.server.koi_control_application.pojo.momo.MomoProduct;
import com.product.server.koi_control_application.pojo.momo.MomoUserInfo;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.service_interface.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.*;

import static com.product.server.koi_control_application.ultil.PaymentUtil.PAYMENT_URL;
import static com.product.server.koi_control_application.ultil.PaymentUtil.sendHttpRequest;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Order", description = "API for Order")
public class OrderController {
    private final IOrderService orderService;
    private final IUserService userService;
    private final JwtTokenUtil jwtUtil;

    @PostMapping("/create-product-order")
    public ResponseEntity<BaseResponse> createOrder(@RequestBody OrderProductDTO req, HttpServletRequest request) throws Exception {

        int userId = jwtUtil.getUserIdFromToken(request);

        Orders createdOrder = orderService.createOrder(userId, req);
        Users userOrdered = userService.getUser(userId);
        //Loop to get all products in order then add to momoProducts
        List<MomoProduct> momoProducts = new ArrayList<>();

        createdOrder.getItems().stream().forEach(orderItems -> {
            MomoProduct momoProduct = new MomoProduct();
            momoProduct.setName(orderItems.getProductId().getName());
            momoProduct.setQuantity(orderItems.getQuantity());
            momoProduct.setPrice(Long.parseLong(orderItems.getProductId().getPrice() + ""));
            momoProduct.setImageUrl(orderItems.getProductId().getImageUrl());
            momoProduct.setTotalPrice(Long.parseLong(orderItems.getProductId().getPrice() * orderItems.getQuantity() + ""));
            momoProduct.setCurrency("VND");
            momoProduct.setTotalPrice(Long.parseLong(orderItems.getProductId().getPrice() * orderItems.getQuantity() + ""));
            momoProduct.setTaxAmount(10L);
            momoProduct.setManufacturer("KOI");
            momoProducts.add(momoProduct);
        });
        MomoUserInfo momoUserInfo = new MomoUserInfo();
        momoUserInfo.setName(req.getFullName());
        momoUserInfo.setPhoneNumber(req.getPhone());
        momoUserInfo.setEmail(userOrdered.getEmail());

        MomoPaymentRequest momoPaymentRequest = MomoPaymentRequest.builder()
                .amount((long) createdOrder.getTotalAmount())
                .orderInfo("Payment for order " + createdOrder.getId())
                .requestId(UUID.randomUUID().toString())
                .userId(String.valueOf(userId))
                .orderId(String.valueOf(createdOrder.getId()))
                .orderType("product")
                .momoProducts(momoProducts)
                .momoUserInfo(momoUserInfo)
                .build();
        String jsonBody = new ObjectMapper().writeValueAsString(momoPaymentRequest);
        HttpResponse<String> response = sendHttpRequest(jsonBody, PAYMENT_URL);
        JsonNode responseBody = new ObjectMapper().readTree(response.body());

        return ResponseUtil.createResponse(responseBody, "Order created successfully", HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getOrder(@PathVariable int id) {
        Orders order = orderService.getOrderById(id);
        return ResponseUtil.createSuccessResponse(order, "Order retrieved successfully");
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getAllOrders() {
        List<Orders> orders = orderService.getAllOrders();
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @GetMapping("/user/{userId}/")
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId, @RequestParam int page, @RequestParam int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @GetMapping("/user/{userId}/list")
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId) {
        List<Orders> orders = orderService.getOrdersByUser(userId);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<BaseResponse> getOrderStatus(@PathVariable int orderId) {
        Orders order = orderService.getOrderById(orderId);

        Map<String, String> map = new HashMap<>();
        map.put("status", order.getStatus());
        return ResponseUtil.createSuccessResponse(map, "Order status retrieved successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> getOrdersByUser(@PathVariable int userId,
                                                        @RequestParam(defaultValue = "0",required = false) int page,
                                                        @RequestParam(defaultValue = "10",required = false) int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "User orders retrieved successfully");
    }

    @DeleteMapping("/user/{userId}/order/{orderId}")
    public ResponseEntity<BaseResponse> cancelPendingOrderByUser(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelPendingOrder(userId, orderId);
        return ResponseUtil.createSuccessResponse(null, "Order cancelled successfully");
    }


}