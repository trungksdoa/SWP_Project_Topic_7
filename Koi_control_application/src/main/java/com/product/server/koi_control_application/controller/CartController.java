package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.CartDTO;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
@Validated
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_MEMBER", "ROLE_ADMIN", "ROLE_SHOP"})
public class CartController {
    private final ICartService cartService;
    private final JwtTokenUtil jwtUtil;
    @PostMapping
    public ResponseEntity<BaseResponse> addToCart(@RequestBody Cart cart, HttpServletRequest request) throws IllegalAccessException {

        int userId = jwtUtil.getUserIdFromToken(request);

        Cart addedCart = cartService.createCart(cart,userId);
        BaseResponse response = BaseResponse.builder()
                .data(addedCart)
                .statusCode(HttpStatus.CREATED.value())
                .message("Item added to cart successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> getCartByUser(@PathVariable int userId) {
        List<Cart> cartItems = cartService.getCart(userId);
        BaseResponse response = BaseResponse.builder()
                .data(cartItems)
                .statusCode(HttpStatus.OK.value())
                .message("Cart items retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> updateCartItem(@RequestBody CartDTO cartDTO,@PathVariable int userId) {

        BaseResponse response = BaseResponse.builder()
                .data( cartService.updateCart(cartDTO,userId))
                .statusCode(HttpStatus.OK.value())
                .message("Cart item updated successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{productId}/user/{userId}")
    public ResponseEntity<BaseResponse> removeFromCart(@PathVariable int productId, @PathVariable int userId) {
        cartService.deleteCart(productId, userId);
        BaseResponse response = BaseResponse.builder()
                .data("Item removed from cart successfully")
                .statusCode(HttpStatus.OK.value())
                .message("Item removed from cart successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}