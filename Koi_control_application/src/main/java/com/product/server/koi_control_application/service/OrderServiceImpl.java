package com.product.server.koi_control_application.service;

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


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;
    private final OrderItemsRepository orderItemsService;
    private final CartRepository cartRepository;


    @Override
    @Transactional
    public Orders createOrder(int userId) {
        // Validate and update product stock
        // Take the items information in cart then place in it order_items table after create order table
        Orders order = Orders.builder()
                .userId(userId)
                .status("PENDING")
                .build();
        orderRepository.save(order);
        cartRepository.findByUserId(userId).forEach(
                cart -> {
                    Product product = productRepository.findById(cart.getProductId()).get();
                    if (product.getStock() < cart.getQuantity()) {
                        throw new InsufficientException("Insufficient stock for product " + product.getName());
                    }
                    product.setStock(product.getStock() - cart.getQuantity());
                    productRepository.save(product);
                    OrderItems orderItems = OrderItems.builder()
                            .orderId(order.getId())
                            .productId(cart.getProductId())
                            .quantity(cart.getQuantity())
                            .build();

                    order.setTotalAmount(product.getPrice() * cart.getQuantity());
                    orderItemsService.save(orderItems);
                    cartRepository.deleteByProductId(cart.getProductId());
                }
        );




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
    public void cancelOrder(int userId,int orderId) {
        Orders order = orderRepository.findByUserIdAndId(userId, orderId);
        if (order == null) {
            throw new ProductNotFoundException("Order not found");
        }
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Override
    public Page<Orders> getOrdersByUser(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findOrdersByUserId(userId, pageable);
    }

}