package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.model.*;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;

public interface IInitializationHelper {
    Orders initOrder(int userId, OrderRequestDTO orderRequestDTO);
    Product initProduct();
    OrderItems initOrderItems(Orders order, Product product, int quantity);
    // Add other init methods as needed
}