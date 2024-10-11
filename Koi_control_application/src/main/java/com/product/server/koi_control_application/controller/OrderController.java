package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.momo.*;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.request.OrderVerifyDTO;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.ICategoryService;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
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

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.mappingInterface.OrderMappings.*;
import static com.product.server.koi_control_application.ultil.PaymentUtil.PAYMENT_URL;
import static com.product.server.koi_control_application.ultil.PaymentUtil.sendHttpRequest;

@RestController
@RequestMapping(BASE_ORDER)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Order", description = "API for Order")
public class OrderController {
    private final IOrderService orderService;
    private final IUserService userService;
    private final JwtTokenUtil jwtUtil;
    private final ICategoryService categoryService;
    private final IPaymentService paymentService;

    //    @PostMapping("/create-product-order")
    @PostMapping(CREATE_ORDER)
    public ResponseEntity<BaseResponse> createOrder(@RequestBody OrderRequestDTO req, HttpServletRequest request) throws Exception {

        int userId = jwtUtil.getUserIdFromToken(request);

        Orders createdOrder = orderService.createOrder(userId, req);
        Users userOrdered = userService.getUser(userId);
        //Loop to get all products in order then add to momoProducts
        List<MomoProduct> momoProducts = createListProduct(createdOrder);

        MomoUserInfo momoUserInfo = new MomoUserInfo();
        momoUserInfo.setName(req.getFullName());
        momoUserInfo.setPhoneNumber(req.getPhone());
        momoUserInfo.setEmail(userOrdered.getEmail());

        MomoPaymentRequest momoPaymentRequest = MomoPaymentRequest.builder()
                .amount((long) createdOrder.getTotalAmount())
                .orderInfo("PaymentStatus for order " + createdOrder.getId())
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

        if (responseBody.get("resultCode").asInt() != 0) {
            orderService.updateOrderStatus(createdOrder.getId(), FAILED.getValue());
            return ResponseUtil.createResponse(
                    new ObjectMapper().readValue(response.body(), MomoResponseOrderFail.class)
                    , "Order creation failed due to payment processing error. Please try again.", HttpStatus.BAD_REQUEST);
        }

        return ResponseUtil.createResponse(
                new ObjectMapper().readValue(response.body(), MomoResponseOrderSuccess.class),
                "Order created successfully", HttpStatus.CREATED);
    }


    //    @GetMapping("/{id}")
    @GetMapping(GET_ORDER_BY_ID)
    public ResponseEntity<BaseResponse> getOrder(@PathVariable int id) {
        Orders order = orderService.getOrderById(id);
        return ResponseUtil.createSuccessResponse(order, "Order retrieved successfully");
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getAllOrders() {
        List<Orders> orders = orderService.getAllOrders();
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    //    @GetMapping("/user/{userId}/")
    @GetMapping(GET_ORDER_BY_USER + '/')
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId, @RequestParam int page, @RequestParam int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    //    @GetMapping("/user/{userId}/list")
    @GetMapping(GET_ORDER_LIST_BY_USER)
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId) {
        List<Orders> orders = orderService.getOrdersByUser(userId);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    //    @GetMapping("/status/{orderId}")
    @GetMapping(GET_ORDER_STATUS)
    public ResponseEntity<BaseResponse> getOrderStatus(@PathVariable int orderId) {
        Orders order = orderService.getOrderById(orderId);

        Map<String, String> map = new HashMap<>();
        map.put("status", order.getStatus());
        return ResponseUtil.createSuccessResponse(map, "Order status retrieved successfully");
    }

    //    @GetMapping("/user/{userId}")
    @GetMapping(GET_ORDER_BY_USER)
    public ResponseEntity<BaseResponse> getOrdersByUser(@PathVariable int userId,
                                                        @RequestParam(defaultValue = "0", required = false) int page,
                                                        @RequestParam(defaultValue = "10", required = false) int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "User orders retrieved successfully");
    }

    //    @DeleteMapping("/user/{userId}/order/{orderId}")
    @DeleteMapping(CANCEL_PENDING_ORDER)
    public ResponseEntity<BaseResponse> cancelPendingOrderByUser(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelPendingOrder(userId, orderId);
        paymentService.updatePaymentStatus(orderId, "product", FAILED.getValue());
        return ResponseUtil.createSuccessResponse(null, "Order cancelled successfully");
    }


    private List<MomoProduct> createListProduct(Orders orders) {
        List<MomoProduct> momoProducts = new ArrayList<>();
        orders.getItems().forEach(orderItems -> {
            Category cate = categoryService.getCategoryById(orderItems.getProductId().getCategoryId());
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
            momoProduct.setDescription(orderItems.getProductId().getDescription());
            momoProduct.setCategory(cate.getName());
            momoProducts.add(momoProduct);
        });
        return momoProducts;
    }

    //    @PostMapping("/receive-order")
    @PostMapping(VERIFY_ORDER)
    @Operation(summary = "Mark an order as received", description = "From other user updates their order status to DELIVERED " + " : " +
            "{" +
            "PENDING," +
            "CANCELLED, " +
            "SUCCESS, " +
            "SHIPPING, " +
            "DELIVERED, " +
            "}")
    public ResponseEntity<BaseResponse> receiveOrder(HttpServletRequest request, OrderVerifyDTO data) {
        //To confirm that the user is an admin
        jwtUtil.getUserIdFromToken(request);
        int orderId = data.getOrderId();
        Orders orders = orderService.updateOrderStatus(orderId, OrderCode.COMPLETED.getValue());
        return ResponseUtil.createSuccessResponse(orders, "Update order status successfully");
    }

    //    @PostMapping("/send-order")
    @PostMapping(SEND_ORDER)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Mark an order as shipped", description = "From admin updates the order status to SHIPPING" + " : " +
            "{" +
            "PENDING," +
            "CANCELLED, " +
            "SUCCESS, " +
            "SHIPPING, " +
            "DELIVERED, " +
            "}")
    public ResponseEntity<BaseResponse> confirmOrder(HttpServletRequest request, OrderVerifyDTO data) {
        jwtUtil.getUserIdFromToken(request);
        int orderId = data.getOrderId();
        Orders orders = orderService.updateOrderStatus(orderId, OrderCode.SHIPPING.getValue());
        return ResponseUtil.createSuccessResponse(orders, "Update order status successfully");
    }


}