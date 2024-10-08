package com.product.server.koi_control_application.service_helper;


import com.product.server.koi_control_application.custom_exception.BadRequestException;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.service_helper.interfaces.IOrderHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderHelper implements IOrderHelper {
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Orders save(Orders order) {
        try {
            log.info("Saving order");
            log.info("Order: {}", order);
            return orderRepository.save(order);
        } catch (Exception e) {
            throw new BadRequestException("Failed to save order");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Orders get(int id) {
        return orderRepository.findById(id).orElseThrow(() -> new BadRequestException("Order not found"));
    }

    @Override
    @Transactional
    public void delete(Orders order) {
        try {
            log.info("Deleting order");
            log.info("Order: {}", order);
            orderRepository.delete(order);
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete order");
        }
    }

    @Override
    public List<Orders> findAll(){
        return orderRepository.findAll();
    }
}
