package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.CheckOut;
import org.springframework.data.domain.Page;

public interface IOrderService {
    Orders createOrder(int userId, CheckOut checkOut) ;

    Orders getOrderById(int id) ;
    Orders updateOrderStatus(int id, String status) ;

    void cancelPendingOrder(int id,int orderId) ;

    void cancelOrderByAdmin(int orderId,String message) ;
    Page<Orders> getOrdersByUser(int userId, int page, int size);
}
