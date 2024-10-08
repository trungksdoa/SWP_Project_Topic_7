package com.product.server.koi_control_application.service_helper;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.*;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.service_helper.interfaces.IInitializationHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;

@Service
public class InitializationHelper implements IInitializationHelper {

    @Override
    public Orders initOrder(int userId, OrderRequestDTO orderRequestDTO) {
        return Orders.builder()
                .userId(userId)
                .status(OrderCode.PENDING.getValue())
                .fullName(orderRequestDTO.getFullName())
                .address(orderRequestDTO.getAddress())
                .phone(orderRequestDTO.getPhone())
                .items(new HashSet<>())
                .build();
    }

    @Override
    public Product initProduct() {
        return Product.builder()
                .stock(0)
                .price(0)
                .disabled(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }



    @Override
    public OrderItems initOrderItems(Orders order, Product product, int quantity) {
        return OrderItems.builder()
                .order(order)
                .productId(product)
                .quantity(quantity)
                .build();
    }

    // Implement other init methods as needed
}