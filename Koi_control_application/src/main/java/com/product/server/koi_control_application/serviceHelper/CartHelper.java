package com.product.server.koi_control_application.serviceHelper;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.repository.CartRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.ICartHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class CartHelper implements ICartHelper {
    private final CartRepository cartRepository;
    @Override
    public Cart save(Cart cart) {
      try{
            log.info("Saving cart");
            log.info("Cart: {}", cart);
            return cartRepository.save(cart);
      }catch (Exception e){
          throw new BadRequestException("Failed to save cart");
      }
    }

    @Override
    public void deleteByUserIdAndProductId(int userId, int productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public void deleteByUserId(int userId) {
        cartRepository.deleteByUserId(userId);
    }
}
