package com.product.server.koi_control_application.serviceHelper.interfaces;

import com.product.server.koi_control_application.model.Orders;

import java.util.List;

public interface IOrderHelper {
    Orders save(Orders order);

    Orders get(int id);

    void delete(Orders order);

    List<Orders> findAll();
}
