package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.enums.OrderStatus;
import com.product.server.koi_control_application.pojo.OrderProductRequest;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.custom_exception.InsufficientException;
import com.product.server.koi_control_application.model.OrderItems;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final CartRepository cartRepository;


    @Override
    public Orders createOrder(int userId, OrderProductRequest orderProductRequest) {
        // Create a new order
        Orders order = Orders.builder()
                .userId(userId)
                .status("PENDING")
                .fullName(orderProductRequest.getFullName())
                .address(orderProductRequest.getAddress())
                .phone(orderProductRequest.getPhone())
                .items(new HashSet<>())
                .build();

        Orders savedOrder = orderRepository.save(order);

        if (cartRepository.findByUserId(userId).isEmpty()) {
            throw new NotFoundException("Your cart may be empty, please add some products to cart, then try again");
        }

        cartRepository.findByUserId(userId).forEach(
                cart -> {
                    Product product = productRepository.findById(cart.getProductId()).orElseThrow(() ->
                            new NotFoundException("Product not found"));

                    // Create order items without stock validation
                    OrderItems orderItems = OrderItems.builder()
                            .productId(productRepository.save(product))
                            .quantity(cart.getQuantity())
                            .order(savedOrder)
                            .build();
                    savedOrder.setTotalAmount(order.getTotalAmount() + product.getPrice() * cart.getQuantity());
                    savedOrder.getItems().add(orderItemsRepository.save(orderItems));
//                    cartRepository.deleteByProductId(cart.getProductId());
                }
        );
        orderRepository.save(savedOrder);
        return order;
    }

    @Override
    public Orders getOrderById(int id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Orders updateOrderStatus(int id, String status) {
        Orders order = orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public List<Orders> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void cancelPendingOrder(int userId, int orderId) {
        Orders order = orderRepository.findByUserIdAndId(userId, orderId);
        if (order == null) {
            throw new NotFoundException("Order not found");
        }
        if(!order.getStatus().equals("PENDING")){
            throw new InsufficientException("Order cannot be cancelled");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Override
    public void cancelOrderByAdmin(int orderId, String message) {
        Orders order = orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Order not found"));

        order.setStatus("CANCELLED");
        order.setResponseFromAdmin(message);
        orderRepository.save(order);
    }

    @Override
    public Page<Orders> getOrdersByUser(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findOrdersByUserId(userId, pageable);
    }

    @Override
    public List<Orders> getOrdersByUser(int userId) {
        return orderRepository.findByUserId(userId);
    }

}