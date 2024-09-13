package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Orders;
import org.springframework.data.domain.Page;

public interface IOrderService {
    Orders createOrder(int userId) ;

    Orders getOrderById(int id) ;
    Orders updateOrderStatus(int id, String status) ;

    void cancelOrder(int id,int orderId) ;
    Page<Orders> getOrdersByUser(int userId, int page, int size);
}
