package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.pojo.OrderProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IOrderService {
    Orders createOrder(int userId, OrderProductRequest orderProductRequest) ;

    Orders getOrderById(int id) ;
    Orders updateOrderStatus(int id, String status) ;

    List<Orders> getAllOrders();
    void cancelPendingOrder(int id,int orderId) ;

    void cancelOrderByAdmin(int orderId,String message) ;
    Page<Orders> getOrdersByUser(int userId, int page, int size);
}