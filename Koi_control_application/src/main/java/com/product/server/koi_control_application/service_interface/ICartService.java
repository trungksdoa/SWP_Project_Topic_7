package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.pojo.request.CartDTO;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;

import java.util.List;

/**
 * This interface defines the contract for cart-related operations.
 * It provides methods for creating, updating, deleting, and retrieving cart information.
 */
public interface ICartService {

    /**
     * Creates a new cart for a user.
     *
     * @param cart        The Cart object to be created.
     * @param validUserId The ID of the user for whom the cart is being created.
     * @return           The created Cart object.
     * @throws IllegalAccessException If the user does not have permission to create a cart.
     */
    Cart createCart(Cart cart, int validUserId) throws IllegalAccessException;

    /**
     * Updates an existing cart with the provided details.
     *
     * @param cartDTO The CartDTO object containing updated cart information.
     * @param userId  The ID of the user whose cart is being updated.
     * @return        The updated Cart object.
     */
    Cart updateCart(CartDTO cartDTO, int userId);

    /**
     * Deletes a product from the user's cart.
     *
     * @param productId The ID of the product to be deleted from the cart.
     * @param userId    The ID of the user whose cart is being modified.
     */
    void deleteCart(int productId, int userId);

    /**
     * Retrieves the cart for a specific user.
     *
     * @param userId The ID of the user whose cart is to be retrieved.
     * @return      A List of CartProductDTO objects representing the items in the cart.
     */
    List<CartProductDTO> getCart(int userId);

    /**
     * Clears all items from the user's cart.
     *
     * @param userId The ID of the user whose cart is to be cleared.
     */
    void clearCart(int userId);
}