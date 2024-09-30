package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.pojo.request.CartDTO;
import com.product.server.koi_control_application.repository.CartRepository;
import com.product.server.koi_control_application.service_interface.ICartService;
import com.product.server.koi_control_application.service_interface.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final CartRepository cartRepository;
    private final IProductService productService;

    @Override
    public Cart createCart(Cart cart, int validUserId) throws IllegalAccessException {
        if (cart.getQuantity() == 0) {
            throw new DataIntegrityViolationException("Quantity must be greater than 0");
        }

        if (cart.getUserId() != validUserId) {
            throw new IllegalAccessException("You are not allowed to add item to this cart");
        }

        if (productService.getProduct(cart.getProductId()) == null) {
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }

        Optional<Cart> savedCart = cartRepository.findByProductIdAndUserId(cart.getProductId(), cart.getUserId());
        if (savedCart.isEmpty()) {
            return cartRepository.save(cart);
        }

        savedCart.get().setQuantity(savedCart.get().getQuantity() + cart.getQuantity());

        return cartRepository.save(savedCart.get());
    }

    @Override
    public Cart updateCart(CartDTO cartDTO, int userId) {
        Cart cart = cartRepository.findByProductIdAndUserId(cartDTO.getProductId(), userId)
                .orElseThrow(() -> new NotFoundException("Sorry, this item has been deleted or not exist "));

        cart.setQuantity(cartDTO.getQuantity());
        return cartRepository.save(cart);
    }

    @Override
    public void deleteCart(int productId, int userId) {

        try {
            if (cartRepository.findByProductIdAndUserId(productId, userId).isEmpty()) {
                throw new NotFoundException("Sorry, this item has been deleted or not exist ");
            }
            cartRepository.deleteByUserIdAndProductId(userId, productId);
        } catch (NotFoundException e) {
            throw new NotFoundException(e.getMessage());
        }
    }

    @Override
    public List<Cart> getCart(int userId) {
        return cartRepository.findByUserId(userId);
    }

    @Override
    public void clearCart(int userId) {
        if (cartRepository.findByUserId(userId).isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        cartRepository.deleteByUserId(userId);
    }
}
