package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.BadRequestException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.service_helper.interfaces.IIProcessHelper;
import com.product.server.koi_control_application.service_helper.interfaces.IOrderHelper;
import com.product.server.koi_control_application.service_interface.ICartService;
import com.product.server.koi_control_application.service_interface.IOrderService;
import com.product.server.koi_control_application.service_interface.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * OrderServiceImpl is a service implementation class that handles various operations related to orders.
 * It implements the IOrderService interface and provides methods for creating, updating, retrieving,
 * and deleting orders. This service interacts with repositories and helper classes to perform necessary
 * business logic and manage order-related actions.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final IProductService productService;
    private final ICartService cartService;
    private final IIProcessHelper processHelper;
    private final IOrderHelper orderHelper;

    /**
     * Creates a new order for a user.
     *
     * @param userId        The ID of the user placing the order.
     * @param orderRequestDTO The OrderRequestDTO object containing order details.
     * @return             The created Orders object after processing.
     * @throws NotFoundException If the cart is empty or products are out of stock.
     * @throws BadRequestException If there are invalid products in the cart.
     * @throws OptimisticLockingFailureException If an optimistic locking failure occurs.
     * This method initializes a new order using the provided user ID and order details,
     * checks the cart for items, validates stock, and processes the order.
     */
    @Override
    @Transactional
    @Retryable(value = {OptimisticLockingFailureException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public Orders createOrder(int userId, OrderRequestDTO orderRequestDTO) {
        // Create a new order
        List<CartProductDTO> cartItems = cartService.getCart(userId);

        // Check if cart is empty
        if (cartItems.isEmpty()) {
            throw new NotFoundException("Your cart may be empty, please add some products to cart, then try again");
        }

        // Check if any product in cart is out of stock
        if (productService.isProductIsDisabledFromCart(cartItems)) {
            throw new BadRequestException("Sorry, some products in your cart are invalid, please remove them and try again");
        }

        Orders order = processHelper.processOrder(userId, orderRequestDTO, cartItems);
        // Process order items
        return orderHelper.save(order);
    }

    /**
     * Retrieves an order by its ID.
     *
     * @param id The ID of the order to retrieve.
     * @return   The Orders object corresponding to the provided ID.
     */
    @Override
    public Orders getOrderById(int id) {
        return orderHelper.get(id);
    }

    /**
     * Updates the status of an existing order.
     *
     * @param id     The ID of the order to update.
     * @param status The new status to set for the order.
     * @return      The updated Orders object.
     */
    @Override
    public Orders updateOrderStatus(int id, String status) {
        Orders order = orderHelper.get(id);
        order.setStatus(status);
        return orderHelper.save(order);
    }

    /**
     * Retrieves all orders.
     *
     * @return A List of all Orders objects.
     */
    @Override
    public List<Orders> getAllOrders() {
        return orderHelper.findAll();
    }

    /**
     * Cancels a pending order for a user.
     *
     * @param userId  The ID of the user who placed the order.
     * @param orderId The ID of the order to cancel.
     * @throws NotFoundException If the order is not found.
     * @throws BadRequestException If the order cannot be cancelled.
     *
     * This method checks if the order is in a pending state and cancels it,
     * updating the stock of the associated products.
     */
    @Override
    public void cancelPendingOrder(int userId, int orderId) {
        Orders order = orderRepository.findByUserIdAndId(userId, orderId)
                .orElseThrow(() -> new NotFoundException("Order not found while cancelling with " + orderId));

        if (!order.getStatus().equals(OrderCode.PENDING.getValue())) {
            throw new IllegalStateException("Order cannot be cancelled");
        }

        processHelper.cancelOrderAndUpdateProductItem(order);
    }

    /**
     * Cancels an order by an admin.
     *
     * @param orderId The ID of the order to cancel.
     * @param message The message from the admin regarding the cancellation.
     */
    @Override
    public void cancelOrderByAdmin(int orderId, String message) {
        Orders order = orderHelper.get(orderId);

        order.setStatus(OrderCode.CANCELLED.getValue());
        order.setResponseFromAdmin(message);
        orderHelper.save(order);
    }

    /**
     * Deletes an order by its ID.
     *
     * @param id The ID of the order to delete.
     *
     * This method removes the order and all associated order items from the database.
     */
    @Override
    public void deleteOrder(int id) {
        Orders order = orderHelper.get(id);

        // Clear all associated OrderItems
        order.getItems().clear();

        // Delete the Order
        orderHelper.delete(order);
    }

    /**
     * Retrieves a paginated list of orders for a user.
     *
     * @param userId The ID of the user whose orders to retrieve.
     * @param page   The page number to retrieve.
     * @param size   The number of orders per page.
     * @return      A Page containing the list of Orders objects.
     */
    @Override
    public Page<Orders> getOrdersByUser(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findOrdersByUserId(userId, pageable);
    }

    /**
     * Retrieves all orders for a user.
     *
     * @param userId The ID of the user whose orders to retrieve.
     * @return      A List of Orders objects for the specified user.
     */
    @Override
    public List<Orders> getOrdersByUser(int userId) {
        return orderRepository.findByUserId(userId);
    }
}