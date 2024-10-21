package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * This interface defines the contract for order-related operations.
 * It provides methods for creating, retrieving, updating, and deleting orders,
 * as well as managing order cancellation and retrieval by user.
 */
public interface IOrderService {

    /**
     * Creates a new order for a user.
     *
     * @param userId        The ID of the user placing the order.
     * @param orderRequestDTO The OrderRequestDTO object containing order details.
     * @return             The created Orders object after processing.
     */
    Orders createOrder(int userId, OrderRequestDTO orderRequestDTO);

    /**
     * Retrieves an order by its ID.
     *
     * @param id The ID of the order to retrieve.
     * @return   The Orders object corresponding to the provided ID.
     */
    Orders getOrderById(int id);

    /**
     * Updates the status of an existing order.
     *
     * @param id     The ID of the order to update.
     * @param status The new status to set for the order.
     * @return      The updated Orders object.
     */
    Orders updateOrderStatus(int id, String status);

    /**
     * Retrieves all orders.
     *
     * @return A List of all Orders objects.
     */
    List<Orders> getAllOrders();

    /**
     * Cancels a pending order for a user.
     *
     * @param userId  The ID of the user who placed the order.
     * @param orderId The ID of the order to cancel.
     */
    void cancelPendingOrder(int userId, int orderId);

    /**
     * Cancels an order by an admin.
     *
     * @param orderId The ID of the order to cancel.
     * @param message The message from the admin regarding the cancellation.
     */
    void cancelOrderByAdmin(int orderId, String message);

    /**
     * Retrieves a paginated list of orders for a user.
     *
     * @param userId The ID of the user whose orders to retrieve.
     * @param page   The page number to retrieve.
     * @param size   The number of orders per page.
     * @return      A Page containing the list of Orders objects.
     */
    Page<Orders> getOrdersByUser(int userId, int page, int size);

    /**
     * Retrieves all orders for a user.
     *
     * @param userId The ID of the user whose orders to retrieve.
     * @return      A List of Orders objects for the specified user.
     */
    List<Orders> getOrdersByUser(int userId);

    /**
     * Deletes an order by its ID.
     *
     * @param id The ID of the order to delete.
     */
    void deleteOrder(int id);

    void updateSimulatorOrder();
}