package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.CartDTO;
import com.product.server.koi_control_application.model.Cart;

import java.util.List;

public interface ICartService {
    Cart createCart(Cart cart);
    Cart updateCart(CartDTO cartDTO,int userId);
    void deleteCart(int productId, int userId);

    List<Cart> getCart(int userId);
}
