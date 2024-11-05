package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.facade.OrderFacade;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.request.OrderVerifyDTO;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IPaymentService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.mappingInterface.OrderMappings.*;

@RestController
@RequestMapping(BASE_ORDER)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

@Tag(name = "Order", description = "API for Order")
public class OrderController {
    private final IOrderService orderService;
    private final JwtTokenUtil jwtUtil;
    private final IPaymentService paymentService;
    private final OrderFacade orderFacade;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @PostMapping(CREATE_ORDER)
    public ResponseEntity<BaseResponse> createOrder(@RequestBody OrderRequestDTO req, HttpServletRequest request) throws Exception {
        int userId = jwtUtil.getUserIdFromToken(request);
        return orderFacade.createOrder(req, userId);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @GetMapping(GET_ORDER_BY_ID)
    public ResponseEntity<BaseResponse> getOrder(@PathVariable int id) {
        Orders order = orderService.getOrderById(id);
        return ResponseUtil.createSuccessResponse(order, "Order retrieved successfully");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<BaseResponse> getAllOrders() {
        List<Orders> orders = orderService.getAllOrders();
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    //    @GetMapping("/user/{userId}/")
    @GetMapping(GET_ORDER_BY_USER + '/')
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId, @RequestParam int page, @RequestParam int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @GetMapping(GET_ORDER_LIST_BY_USER)
    public ResponseEntity<BaseResponse> getAllOrdersByUser(@PathVariable int userId) {
        List<Orders> orders = orderService.getOrdersByUser(userId);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @GetMapping(GET_ORDER_STATUS)
    public ResponseEntity<BaseResponse> getOrderStatus(@PathVariable int orderId) {
        Orders order = orderService.getOrderById(orderId);

        Map<String, String> map = new HashMap<>();
        map.put("status", order.getStatus());
        return ResponseUtil.createSuccessResponse(map, "Order status retrieved successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @GetMapping(GET_ORDER_BY_USER)
    public ResponseEntity<BaseResponse> getOrdersByUser(@PathVariable int userId,
                                                        @RequestParam(defaultValue = "0", required = false) int page,
                                                        @RequestParam(defaultValue = "10", required = false) int size) {
        Page<Orders> orders = orderService.getOrdersByUser(userId, page, size);
        return ResponseUtil.createSuccessResponse(orders, "User orders retrieved successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @DeleteMapping(CANCEL_PENDING_ORDER)
    public ResponseEntity<BaseResponse> cancelPendingOrderByUser(@PathVariable int userId, @PathVariable int orderId) {
        orderService.cancelPendingOrder(userId, orderId);
        paymentService.updatePaymentStatus(orderId, "product", FAILED.getValue());
        return ResponseUtil.createSuccessResponse(null, "Order cancelled successfully");
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
    @PostMapping(VERIFY_ORDER)
    @Operation(summary = "Mark an order as received", description = "From other user updates their order status to DELIVERED " + " : " +
            "{" +
            "PENDING," +
            "CANCELLED, " +
            "SUCCESS, " +
            "SHIPPING, " +
            "DELIVERED, " +
            "}")
    public ResponseEntity<BaseResponse> receiveOrder(@RequestBody OrderVerifyDTO data) {
        //To confirm that the user is an admin
        int orderId = data.getOrderId();
        Orders orders = orderService.updateOrderStatus(orderId, OrderCode.COMPLETED.getValue());
        return ResponseUtil.createSuccessResponse(orders, "Update order status successfully");
    }

    //    @PostMapping("/send-order")
    @PostMapping(SEND_ORDER)
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    @Operation(summary = "Mark an order as shipped", description = "From admin updates the order status to SHIPPING" + " : " +
            "{" +
            "PENDING," +
            "CANCELLED, " +
            "SUCCESS, " +
            "SHIPPING, " +
            "DELIVERED, " +
            "}")
    public ResponseEntity<BaseResponse> confirmOrder(@RequestBody OrderVerifyDTO data) {
        int orderId = data.getOrderId();
        Orders orders = orderService.updateOrderStatus(orderId, OrderCode.SHIPPING.getValue());
        return ResponseUtil.createSuccessResponse(orders, "Update order status successfully");
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    @PostMapping("/order/delivered")
    public ResponseEntity<BaseResponse> updateDeliveredOrder(@RequestBody OrderVerifyDTO data) {
        int orderId = data.getOrderId();
        Orders orders = orderService.updateOrderStatus(orderId, OrderCode.DELIVERED.getValue());
        return ResponseUtil.createSuccessResponse(orders, "Update order status successfully");
    }


    @GetMapping("/feedback-order/{productId}")
    public ResponseEntity<BaseResponse> getOrdersByStatus(HttpServletRequest request, @PathVariable int productId) {
        int userId = jwtUtil.getUserIdFromToken(request);
        List<Orders> orders = orderService.getAllOrderWithFeedback(productId, userId);
        return ResponseUtil.createSuccessResponse(orders, "Orders retrieved successfully");
    }
}