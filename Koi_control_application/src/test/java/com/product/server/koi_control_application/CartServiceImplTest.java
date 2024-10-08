package com.product.server.koi_control_application;

import com.product.server.koi_control_application.custom_exception.BadRequestException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.repository.CartRepository;
import com.product.server.koi_control_application.service.CartServiceImpl;
import com.product.server.koi_control_application.service_helper.CartHelper;
import com.product.server.koi_control_application.service_interface.IProductService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Transactional
class CartServiceImplTest {
    @Mock
    private CartRepository cartRepository;

    @Mock
    private IProductService productService;

    @Mock
    private CartHelper cartHelper;

    @InjectMocks
    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createCartWithInvalidUserId() {
        Cart cart = new Cart();
        cart.setUserId(28);
        cart.setProductId(42);
        cart.setQuantity(100);


        Product product = new Product();
        product.setId(42);
        product.setStock(100);

        when(productService.getProduct(42)).thenReturn(product);
        when(cartHelper.save(any(Cart.class))).thenReturn(cart);

        assertThrows(IllegalAccessException.class, () -> cartService.createCart(cart, 34));

        verify(cartHelper,never()).save(any(Cart.class));
    }

    @Test
    void createCartWithNonExistingProduct()  {
        Cart cart = new Cart();
        cart.setUserId(34);
        cart.setProductId(42);
        cart.setQuantity(100);

        when(productService.getProduct(42)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> cartService.createCart(cart, 34));

        verify(productService).getProduct(42);
        verify(cartHelper, never()).save(any(Cart.class));
    }

    @Test
    void createCartWithOutStockProduct(){
        Cart cart =new Cart();

        cart.setUserId(34);
        cart.setProductId(42);
        cart.setQuantity(100);

        Product product = new Product();
        product.setId(42);
        product.setStock(50);

        when(productService.getProduct(42)).thenReturn(product);
        when(cartHelper.save(any(Cart.class))).thenReturn(cart);

        assertThrows(BadRequestException.class, () -> cartService.createCart(cart, 34));

        verify(cartHelper, never()).save(any(Cart.class));
    }
}