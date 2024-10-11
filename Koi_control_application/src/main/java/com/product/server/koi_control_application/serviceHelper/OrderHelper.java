package com.product.server.koi_control_application.serviceHelper;


import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IOrderHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

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
            log.info("Saving order: {}", order);
            return orderRepository.save(order);
        } catch (Exception e) {
            log.error("Failed to save order: ", e);
            throw new BadRequestException("Failed to save order: " + e.getMessage());
        }
    }

    @Override
    public Orders get(int id) {
        return orderRepository.findById(id).orElseThrow(() -> new BadRequestException("Order not found"));
    }

    @Override
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
