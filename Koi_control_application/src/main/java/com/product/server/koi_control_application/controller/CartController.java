package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.request.CartDTO;
import com.product.server.koi_control_application.serviceInterface.ICartService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.CartMappings.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_CART)
@Validated
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Cart", description = "APIs for managing cart")
public class CartController {
    private final ICartService cartService;
    private final JwtTokenUtil jwtUtil;


//    @PostMapping("/apply-coupon")
//    @Operation(summary = "Apply coupon to cart", description = "Applies a coupon code to the user's cart")
//    public ResponseEntity<BaseResponse> applyCoupon(@RequestBody @Valid CouponDTO couponDTO, HttpServletRequest request) {
//        throw new UnsupportedOperationException("This method is not implemented yet");
//    }

//    @DeleteMapping("/remove-coupon")
//    @Operation(summary = "Remove coupon from cart", description = "Removes the applied coupon from the user's cart")
//    public ResponseEntity<BaseResponse> removeCoupon(HttpServletRequest request) {
//        throw new UnsupportedOperationException("This method is not implemented yet");
//    }

    @GetMapping("/summary")
    @Operation(summary = "Get cart summary", description = "Retrieves a summary of the user's cart including total price, discounts, and taxes")
    public ResponseEntity<BaseResponse> getCartSummary(HttpServletRequest request) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/save-for-later/{cartItemId}")
    @Operation(summary = "Save cart item for later", description = "Moves a cart item to the 'Save for Later' list")
    public ResponseEntity<BaseResponse> saveForLater(@PathVariable int cartItemId, HttpServletRequest request) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/move-to-cart/{savedItemId}")
    @Operation(summary = "Move saved item to cart", description = "Moves a saved item back to the active cart")
    public ResponseEntity<BaseResponse> moveToCart(@PathVariable int savedItemId, HttpServletRequest request) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping
    public ResponseEntity<BaseResponse> addToCart(@RequestBody @Valid Cart cart, HttpServletRequest request)  {
        try {
            int userId = jwtUtil.getUserIdFromToken(request);
            Cart addedCart = cartService.createCart(cart, userId);
            return ResponseUtil.createResponse(addedCart, "Item added to cart successfully", HttpStatus.CREATED);
        } catch (IllegalAccessException e) {
            return ResponseUtil.createErrorResponse("Error adding item to cart: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping(GET_CART_BY_USER)
    public ResponseEntity<BaseResponse> getCartByUser(@PathVariable int userId) {
        return ResponseUtil.createSuccessResponse(cartService.getCart(userId), "Cart items retrieved successfully");
    }


    @PutMapping(PUT_CART)
    public ResponseEntity<BaseResponse> updateCartItem(@RequestBody @Valid CartDTO cartDTO, @PathVariable int userId) {
        return ResponseUtil.createSuccessResponse(cartService.updateCart(cartDTO, userId), "Cart item updated successfully");
    }



    @DeleteMapping(REMOVE_CART_ITEM)
    public ResponseEntity<BaseResponse> removeFromCart(@PathVariable int productId, @PathVariable int userId) {
        cartService.deleteCart(productId, userId);
        return ResponseUtil.createSuccessResponse("OK", "Item removed from cart successfully");
    }
}