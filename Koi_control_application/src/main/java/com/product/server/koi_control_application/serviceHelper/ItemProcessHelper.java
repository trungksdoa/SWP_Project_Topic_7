package com.product.server.koi_control_application.serviceHelper;

import com.product.server.koi_control_application.customException.InsufficientStockException;
import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.OrderItems;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IIProcessHelper;
import com.product.server.koi_control_application.serviceHelper.interfaces.IInitializationHelper;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ItemProcessHelper implements IIProcessHelper {
    private final OrderRepository orderRepository;
    private final IProductService productService;
    private final IInitializationHelper initService;
    private final IUserService userService;

    /*
     * Processes an order for a user.
     *
     * @param userId        The ID of the user placing the order.
     * @param orderRequestDTO The OrderRequestDTO object containing order details.
     * @param cartItems     A list of CartProductDTO objects representing items in the cart.
     * @return             The created Orders object after processing.
     *
     * This method initializes a new order using the provided user ID and order details,
     * adds items from the cart to the order, and saves the order to the repository.
     */
        @Override
        public Orders processOrder(int userId, OrderRequestDTO orderRequestDTO, List<CartProductDTO> cartItems) {

            Users user = userService.getUser(userId);


            Optional.ofNullable(orderRequestDTO.getFullName()).ifPresentOrElse(
                    orderRequestDTO::setFullName,
                    () -> orderRequestDTO.setFullName(user.getUsername())
            );

            Optional.ofNullable(orderRequestDTO.getAddress()).ifPresentOrElse(
                    orderRequestDTO::setAddress,
                    () -> orderRequestDTO.setAddress(user.getAddress())
            );

            Optional.ofNullable(orderRequestDTO.getPhone()).ifPresentOrElse(
                    orderRequestDTO::setPhone,
                    () -> orderRequestDTO.setPhone(user.getPhoneNumber())
            );
            // Create a new order
            Orders order = initService.initOrder(userId, orderRequestDTO);

            // Add item to order

            return addItemsToOrder(order, cartItems);
        }

    /*
     * Cancels an order and updates the stock of the associated products.
     *
     * @param order The Orders object representing the order to be canceled.
     *
     * This method iterates through the items in the order, increases the stock of each
     * product based on the quantity in the order, and sets the order status to cancelled.
     * Finally, it saves the updated order to the repository.
     */
    @Override
    public void cancelOrderAndUpdateProductItem(Orders order) {
        for (OrderItems item : order.getItems()) {
            Product product = productService.getProduct(item.getProductId().getId());
            productService.increaseProductQuantity(product, item.getQuantity());
        }
        order.setStatus(OrderCode.CANCELLED.getValue());
        orderRepository.save(order);
    }

    /*
     * Adds items from the cart to the initialized order.
     *
     * @param initOrder   The Orders object to which items will be added.
     * @param cartItems   A list of CartProductDTO objects representing items in the cart.
     * @return           The updated Orders object with added items.
     *
     * This method checks the stock for each product in the cart. If sufficient stock is
     * available, it initializes an OrderItems object for each cart item, adds it to the
     * order, and updates the total amount of the order. If stock is insufficient, it
     * throws an InsufficientStockException.
     */
    private Orders addItemsToOrder(Orders initOrder, List<CartProductDTO> cartItems) {
        for (CartProductDTO cart : cartItems) {
            Product product = productService.getProduct(cart.getProductId());
            OrderItems orderItem = initService.initOrderItems(initOrder, product, cart.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            initOrder.getItems().add(orderItem);
            initOrder.setTotalAmount(initOrder.getTotalAmount() + product.getPrice() * cart.getQuantity());
        }
        return initOrder;
    }


}
