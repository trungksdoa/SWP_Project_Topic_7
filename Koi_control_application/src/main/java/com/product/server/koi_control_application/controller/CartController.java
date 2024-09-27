package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.CartDTO;
import com.product.server.koi_control_application.pojo.ErrorResponse;
import com.product.server.koi_control_application.service_interface.ICartService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carts")
@Validated
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Cart Controller", description = "APIs for managing cart")
public class CartController {
    private final ICartService cartService;
    private final JwtTokenUtil jwtUtil;


    @PostMapping
    public ResponseEntity<BaseResponse> addToCart(@RequestBody Cart cart, HttpServletRequest request) throws IllegalAccessException {
        try {
            int userId = jwtUtil.getUserIdFromToken(request);
            Cart addedCart = cartService.createCart(cart, userId);
            return ResponseUtil.createResponse(addedCart, "Item added to cart successfully", HttpStatus.CREATED);
        } catch (IllegalAccessException e) {
            return ResponseUtil.createErrorResponse("Error adding item to cart: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> getCartByUser(@PathVariable int userId) {
        return ResponseUtil.createSuccessResponse(cartService.getCart(userId), "Cart items retrieved successfully");
    }


    @PutMapping("/user/{userId}")
    public ResponseEntity<BaseResponse> updateCartItem(@RequestBody CartDTO cartDTO, @PathVariable int userId) {
        return ResponseUtil.createSuccessResponse(cartService.updateCart(cartDTO, userId), "Cart item updated successfully");
    }



    @DeleteMapping("/remove/{productId}/user/{userId}")
    public ResponseEntity<BaseResponse> removeFromCart(@PathVariable int productId, @PathVariable int userId) {
        cartService.deleteCart(productId, userId);
        return ResponseUtil.createSuccessResponse("OK", "Item removed from cart successfully");
    }
}