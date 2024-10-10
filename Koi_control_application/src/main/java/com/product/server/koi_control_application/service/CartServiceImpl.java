package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.OutStockProduct;
import com.product.server.koi_control_application.pojo.request.CartDTO;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.CartRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.ICartHelper;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    private final CartRepository cartRepository;
    private final IProductService productService;
    private final ICartHelper cartHelper;
    @Override
    public Cart createCart(Cart cart, int validUserId) throws IllegalAccessException {
        if (cart.getUserId() != validUserId) {
            throw new IllegalAccessException("You are not allowed to add item to this cart");
        }

        Product  product = productService.getProduct(cart.getProductId());
        if (product == null) {
            throw new NotFoundException("Sorry, this item has been deleted or not exist ");
        }

        if(product.getStock() < cart.getQuantity()){
            throw new BadRequestException("Sorry, this item is out of stock");
        }


        Optional<Cart> savedCart = cartRepository.findByProductIdAndUserId(cart.getProductId(), cart.getUserId());

        if (savedCart.isPresent()) {
            throw new BadRequestException("This item already exist in your cart");
        }

        return cartHelper.save(cart);
    }

    @Override
    public Cart updateCart(CartDTO cartDTO, int userId) {
        Cart cart = cartRepository.findByProductIdAndUserId(cartDTO.getProductId(), userId)
                .orElseThrow(() -> new NotFoundException("Sorry, this item has been deleted or not exist "));

        cart.setQuantity(cartDTO.getQuantity());
        return cartHelper.save(cart);
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
    public List<CartProductDTO> getCart(int userId) {
        List<CartProductDTO> cart = cartRepository.getCartByUserId(userId);

        OutStockProduct outStockProduct = productService.checkProductOutStock(cart);

        if (outStockProduct.getOutStockProducts() != null && !outStockProduct.getOutStockProducts().isEmpty()) {
            productService.setDisableProduct(outStockProduct);
        }

        return cart;
    }


    @Override
    public void clearCart(int userId) {
        if (cartRepository.findByUserId(userId).isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        cartRepository.deleteByUserId(userId);
    }
}
