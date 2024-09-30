package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.InsufficientException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.enums.OrderStatus;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.model.OrderItems;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.request.OrderProductDTO;
import com.product.server.koi_control_application.repository.OrderItemsRepository;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.service_interface.ICartService;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.service_interface.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final IProductService productService;
    private final OrderItemsRepository orderItemsRepository;
    private final ICartService cartService;


    @Override
    public Orders createOrder(int userId, OrderProductDTO orderProductDTO) {
        // Create a new order
        List<Cart> cartItems = cartService.getCart(userId);

        if (cartItems.isEmpty()) {
            throw new NotFoundException("Your cart may be empty, please add some products to cart, then try again");
        }
        Orders order = createInitialOrder(userId, orderProductDTO);
        return orderRepository.save(processOrderItems(order, cartItems));
    }

    @Override
    public Orders getOrderById(int id) {
        return orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
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
        Orders order = orderRepository.findByUserIdAndId(userId, orderId).orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getStatus().equals(OrderStatus.PENDING.getValue())) {
            throw new InsufficientException("Order cannot be cancelled");
        }

        cancelOrder(order);
    }

    @Override
    public void cancelOrderByAdmin(int orderId, String message) {
        Orders order = orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("Order not found"));

        order.setStatus(OrderStatus.CANCELED.getValue());
        order.setResponseFromAdmin(message);
        orderRepository.save(order);
    }

    @Override
    public void deleteOrder(int id) {
        Orders order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Xóa tất cả các OrderItems liên quan
        order.getItems().clear();

        // Xóa Order
        orderRepository.delete(order);
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


    private Orders createInitialOrder(int userId, OrderProductDTO orderProductDTO) {
        return Orders.builder()
                .userId(userId)
                .status(OrderStatus.PENDING.getValue())
                .fullName(orderProductDTO.getFullName())
                .address(orderProductDTO.getAddress())
                .phone(orderProductDTO.getPhone())
                .items(new HashSet<>())
                .build();
    }

    private OrderItems createOrderItem(Orders order, Product product, int quantity) {
        return OrderItems.builder()
                .order(order)
                .productId(product)
                .quantity(quantity)
                .build();
    }

    private Orders processOrderItems(Orders order, List<Cart> cartItems) {
        for (Cart cart : cartItems) {
            Product product = productService.getProduct(cart.getProductId());
            productService.decreaseProductQuantity(product.getId(), cart.getQuantity());
            OrderItems orderItem = createOrderItem(order, product, cart.getQuantity());
            order.getItems().add(orderItem);
            order.setTotalAmount(order.getTotalAmount() + product.getPrice() * cart.getQuantity());
        }
        return orderRepository.save(order);
    }

    private void cancelOrder(Orders order) {
        for (OrderItems item : order.getItems()) {
            Product product = productService.getProduct(item.getProductId().getId());
            productService.increaseProductQuantity(product.getId(), item.getQuantity());
        }
        order.setStatus(OrderStatus.CANCELED.getValue());
        orderRepository.save(order);
    }
}