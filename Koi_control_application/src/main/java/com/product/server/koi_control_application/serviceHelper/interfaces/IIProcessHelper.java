package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;

import java.util.List;

/**
 * This interface defines the contract for order processing operations.
 * It provides methods for processing orders and managing order-related actions.
 */
public interface IIProcessHelper {

    /**
     * Processes an order for a user.
     *
     * @param userId        The ID of the user placing the order.
     * @param orderRequestDTO The OrderRequestDTO object containing order details.
     * @param cartItems     A list of CartProductDTO objects representing items in the cart.
     * @return             The created Orders object after processing.
     * This method initializes a new order using the provided user ID and order details,
     * adds items from the cart to the order, and returns the processed order.
     */
    Orders processOrder(int userId, OrderRequestDTO orderRequestDTO, List<CartProductDTO> cartItems);

    /**
     * Cancels an order and updates the stock of the associated products.
     *
     * @param order The Orders object representing the order to be canceled.
     * This method iterates through the items in the order, increases the stock of each
     * product based on the quantity in the order, and sets the order status to canceled.
     */
    void cancelOrderAndUpdateProductItem(Orders order);
}