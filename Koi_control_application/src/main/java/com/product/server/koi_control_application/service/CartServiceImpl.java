package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.request.CartDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.CartRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.ICartHelper;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final CartRepository cartRepository;
    private final IProductService productService;
    private final ICartHelper cartHelper;


    @Override
    @Transactional
    public Cart createCart(Cart cart, int validUserId) throws IllegalAccessException {
        if (cart.getUserId() != validUserId) {
            throw new IllegalAccessException("You are not allowed to add item to this cart");
        }

        Product product = productService.getProduct(cart.getProductId());
        if (product == null) {
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }

        if (product.getStock() < cart.getQuantity()) {
            throw new BadRequestException("Sorry, the item is remaining " + product.getStock());
        }


        Optional<Cart> savedCart = cartRepository.findByProductAndUserId(cart.getProductId(), cart.getUserId());

        if (savedCart.isPresent()) {
            throw new BadRequestException("This item already exist in your cart");
        }

        return cartHelper.save(cart);
    }


    @Override
    @Transactional
    public CartProductDTO updateCart(CartDTO cartDTO, int userId) {
        Cart cart = cartRepository.findByProductAndUserId(cartDTO.getProductId(), userId)
                .orElseThrow(() -> new NotFoundException("Sorry, this item has been deleted or not exist "));

        Product product = productService.getProduct(cartDTO.getProductId());
        if (product == null) {
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }

        if (product.getStock() == 0) {
            throw new BadRequestException("Sorry, this item is out of stock");
        }


        CartProductDTO cartResponse = CartProductDTO.builder()
                .id(cart.getId())
                .productId(cart.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .quantity(cart.getQuantity())
                .build();

        if (product.getStock() < cartDTO.getQuantity()) {
            cart.setQuantity(product.getStock());
            cartResponse.setMessage("Sorry, the item is remaining " + product.getStock());
        } else {
            cart.setQuantity(cartDTO.getQuantity());
            cartResponse.setMessage("Cart item updated successfully");
        }

        Cart savedCart = cartHelper.save(cart);
        cartResponse.setQuantity(savedCart.getQuantity());
        return cartResponse;
    }

    @Override
    @Transactional
    public void deleteCart(int productId, int userId) {

        if (cartRepository.findByProductAndUserId(productId, userId).isEmpty()) {
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }
        cartHelper.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartProductDTO> getCart(int userId) {
        List<CartProductDTO> cart = cartRepository.getCartByUserId(userId);
        // Optionally sort the cart to move unavailable or disabled items to the end
        for (CartProductDTO cartProductDTO : cart) {
            Product currentProduct = productService.getProduct(cartProductDTO.getProductId());
            if (currentProduct == null) {
                cartProductDTO.setDisabled(true);
                cartProductDTO.setMessage("This product is no longer available.");
            } else if (currentProduct.getStock() < cartProductDTO.getQuantity()) {
                cartProductDTO.setQuantityChanged(true);
                cartProductDTO.setMessage("Available remain: " + currentProduct.getStock() + ". Please update quantity "+ currentProduct.getName());
            }
        }

        cart.sort(Comparator.comparing(CartProductDTO::isDisabled).thenComparing(CartProductDTO::getProductId));
        return cart;
    }


    @Override
    @Transactional
    public void clearCart(int userId) {
        if (cartRepository.findByUserId(userId).isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        cartHelper.deleteByUserId(userId);
    }
}
