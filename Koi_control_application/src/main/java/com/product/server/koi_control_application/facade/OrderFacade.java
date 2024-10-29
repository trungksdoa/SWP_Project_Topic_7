package com.product.server.koi_control_application.facade;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.model.OrderItems;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentRequest;
import com.product.server.koi_control_application.pojo.momo.MomoPaymentResponse;
import com.product.server.koi_control_application.pojo.momo.MomoProduct;
import com.product.server.koi_control_application.pojo.momo.MomoUserInfo;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.request.OrderVerifyDTO;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service.MomoPaymentService;
import com.product.server.koi_control_application.serviceInterface.ICategoryService;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderFacade {
    private final IOrderService orderService;
    private final IUserService userService;
    private final ICategoryService categoryService;
    private final MomoPaymentService payProcessor;

    public ResponseEntity<BaseResponse> createOrder(OrderRequestDTO request, int userId) throws Exception {
        // Create order
        Orders createdOrder = orderService.createOrder(userId, request);

        // Process payment
        MomoPaymentRequest paymentRequest = buildPaymentRequest(createdOrder, request, userId);

        MomoPaymentResponse paymentResponse = payProcessor.createPayment(paymentRequest).getBody();


        return ResponseUtil.createResponse(
                paymentResponse,
                "Order created successfully", HttpStatus.CREATED);
    }

    private MomoPaymentRequest buildPaymentRequest(Orders order, OrderRequestDTO request, int userId) {
        Users user = userService.getUser(userId);
        List<MomoProduct> momoProducts = createMomoProducts(order);
        MomoUserInfo userInfo = createMomoUserInfo(request, user);

        return MomoPaymentRequest.builder()
                .amount((long) order.getTotalAmount())
                .orderInfo("Payment for order " + order.getId())
                .requestId(UUID.randomUUID().toString())
                .userId(String.valueOf(userId))
                .orderId(String.valueOf(order.getId()))
                .orderType("product")
                .momoProducts(momoProducts)
                .momoUserInfo(userInfo)
                .build();
    }

    private List<MomoProduct> createMomoProducts(Orders order) {
        return order.getItems().stream()
                .map(this::convertToMomoProduct)
                .toList();
    }

    private MomoProduct convertToMomoProduct(OrderItems item) {
        Category category = categoryService.getCategoryById(item.getProductId().getCategoryId());
        return MomoProduct.builder()
                .name(item.getProductId().getName())
                .quantity(item.getQuantity())
                .price((long) item.getProductId().getPrice())
                .imageUrl(item.getProductId().getImageUrl())
                .totalPrice((long) item.getProductId().getPrice() * item.getQuantity())
                .currency("VND")
                .taxAmount(10L)
                .manufacturer("KOI")
                .description(item.getProductId().getDescription())
                .category(category.getName())
                .build();
    }

    private MomoUserInfo createMomoUserInfo(OrderRequestDTO request, Users user) {
        return MomoUserInfo.builder()
                .name(request.getFullName())
                .phoneNumber(request.getPhone())
                .email(user.getEmail())
                .build();
    }

    public void updateOrderStatus(OrderVerifyDTO data, OrderCode status) {
        orderService.updateOrderStatus(data.getOrderId(), status.getValue());
    }
}