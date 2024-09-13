package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.ProductNotFoundException;
import com.product.server.koi_control_application.dto.CartDTO;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final CartRepository cartRepository;

    @Override
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateCart(CartDTO cartDTO, int userId) {
        Cart cart = cartRepository.findByProductIdAndUserId(cartDTO.getProductId(), userId)
                .orElseThrow(() -> new ProductNotFoundException("Sorry, this item has been deleted or not exist "));

        cart.setQuantity(cartDTO.getQuantity());
        return cartRepository.save(cart);
    }
        @Override
    public void deleteCart(int productId, int userId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }



    @Override
    public List<Cart> getCart(int userId) {
        // Get cart
        return cartRepository.findByUserId(userId);
    }
}
