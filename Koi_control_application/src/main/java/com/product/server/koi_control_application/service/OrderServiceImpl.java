package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.BadRequestException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.OrderItems;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
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
    private final ICartService cartService;


    @Override
    public Orders createOrder(int userId, OrderRequestDTO orderRequestDTO) {
        // Create a new order
        List<CartProductDTO> cartItems = cartService.getCart(userId);

        // Check if cart is empty
        if (cartItems.isEmpty()) {
            throw new NotFoundException("Your cart may be empty, please add some products to cart, then try again");
        }

        // Check if any product in cart is out of stock
        if (productService.isProductIsDisabledFromCart(cartItems)) {
            throw new BadRequestException("Sorry, some products in your cart are invalid , please remove them and try again");
        }

        // Check if any product in cart is out of stock
        Orders order = createInitialOrder(userId, orderRequestDTO);

        // Process order items
        return orderRepository.save(processOrderItems(order, cartItems));
    }

    @Override
    public Orders getOrderById(int id) {
        return orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Order not found by" + id));
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
        Orders order = orderRepository.findByUserIdAndId(userId, orderId).orElseThrow(() -> new NotFoundException("Order not found  while cancle with" + orderId));

        if (!order.getStatus().equals(OrderCode.PENDING.getValue())) {
            throw new BadRequestException("Order cannot be cancelled");
        }

        cancelOrder(order);
    }

    @Override
    public void cancelOrderByAdmin(int orderId, String message) {
        Orders order = orderRepository.findById(orderId).orElseThrow(() -> new NotFoundException("(ADMIN) Order not found by " + orderId));

        order.setStatus(OrderCode.CANCELLED.getValue());
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


    private Orders createInitialOrder(int userId, OrderRequestDTO orderRequestDTO) {
        return Orders.builder()
                .userId(userId)
                .status(OrderCode.PENDING.getValue())
                .fullName(orderRequestDTO.getFullName())
                .address(orderRequestDTO.getAddress())
                .phone(orderRequestDTO.getPhone())
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

    private Orders processOrderItems(Orders order, List<CartProductDTO> cartItems) {
        for (CartProductDTO cart : cartItems) {
            Product product = productService.getProduct(cart.getProductId());
            OrderItems orderItem = createOrderItem(order, product, cart.getQuantity());
            order.getItems().add(orderItem);
            order.setTotalAmount(order.getTotalAmount() + product.getPrice() * cart.getQuantity());
            productService.decreaseProductQuantity(product.getId(), cart.getQuantity());
        }
        System.out.println(order);
        return orderRepository.save(order);
    }

    private void cancelOrder(Orders order) {
        for (OrderItems item : order.getItems()) {
            Product product = productService.getProduct(item.getProductId().getId());
            productService.increaseProductQuantity(product.getId(), item.getQuantity());
        }
        order.setStatus(OrderCode.CANCELLED.getValue());
        orderRepository.save(order);
    }
}