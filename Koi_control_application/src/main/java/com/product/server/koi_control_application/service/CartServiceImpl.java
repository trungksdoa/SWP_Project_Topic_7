package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.pojo.CartDTO;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final CartRepository cartRepository;
    private final UsersRepository usersRepository;
    @Override
    public Cart createCart(Cart cart, int validUserId) throws IllegalAccessException {
        if(cart.getQuantity() == 0){
            throw new DataIntegrityViolationException("Quantity must be greater than 0");
        }

        if(cart.getUserId() != validUserId){
            throw new IllegalAccessException("You are not allowed to add item to this cart");
        }

        if(cartRepository.findByProductIdAndUserId(cart.getProductId(), cart.getUserId()).isPresent()){
            throw new IllegalArgumentException("This item is already in your cart");
        }



        return cartRepository.save(cart);
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
        if(cartRepository.findByProductIdAndUserId(productId, userId).isEmpty()){
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }



    @Override
    public List<Cart> getCart(int userId) {
        // Get cart
        return cartRepository.findByUserId(userId);
    }
}
