package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.model.Cart;
import org.springframework.transaction.annotation.Transactional;

public interface ICartHelper {
    Cart save(Cart cart);

    @Transactional
    void deleteByUserIdAndProductId(int userId, int productId);

    @Transactional
    void deleteByUserId(int userId);
}
