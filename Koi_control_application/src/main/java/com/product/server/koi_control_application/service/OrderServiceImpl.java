package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.customException.InsufficientException;
import com.product.server.koi_control_application.customException.ProductNotFoundException;
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


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final CartRepository cartRepository;


    @Override
    @Transactional
    public Orders createOrder(int userId) {
        // Validate and update product stock
        // Take the items information in cart then place in it order_items table after create order table
        Orders order = Orders.builder()
                .userId(userId)
                .status("PENDING")
                .items(new HashSet<>())
                .build();

        Orders savedOrder =   orderRepository.save(order);

        if (cartRepository.findByUserId(userId).isEmpty()) {
            throw new ProductNotFoundException("Your cart may be empty, please add some products to cart, then try again");
        }

        cartRepository.findByUserId(userId).forEach(
                cart -> {
                    Product product = productRepository.findById(cart.getProductId()).get();
                  
                    if (product.getStock() < cart.getQuantity()) {
                        throw new InsufficientException("Insufficient stock for product " + product.getName());
                    }

                    product.setStock(product.getStock() - cart.getQuantity());

                    OrderItems orderItems = OrderItems.builder()
                            .productId(productRepository.save(product))
                            .quantity(cart.getQuantity())
                            .order(savedOrder)
                            .build();
                    savedOrder.setTotalAmount(order.getTotalAmount() + product.getPrice() * cart.getQuantity());
                    savedOrder.getItems().add(orderItemsRepository.save(orderItems));
                    cartRepository.deleteByProductId(cart.getProductId());
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
    @Transactional
    public Orders updateOrderStatus(int id, String status) {
        Orders order = getOrderById(id).builder().status(status).build();
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void cancelPendingOrder(int userId, int orderId) {
        Orders order = orderRepository.findByUserIdAndId(userId, orderId);
        if (order == null) {
            throw new ProductNotFoundException("Order not found");
        }
        if(!order.getStatus().equals("PENDING")){
            throw new InsufficientException("Order cannot be cancelled");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Override
    @Transactional
    public void cancelOrderByAdmin(int userId, int orderId, String message) {
        Orders order = orderRepository.findByUserIdAndId(userId, orderId);
        if (order == null) {
            throw new ProductNotFoundException("Order not found");
        }

        order.setStatus("CANCELLED");
        order.setResponseFromAdmin(message);
        orderRepository.save(order);
    }

    @Override
    public Page<Orders> getOrdersByUser(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findOrdersByUserId(userId, pageable);
    }

}