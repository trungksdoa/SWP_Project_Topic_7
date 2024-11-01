package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final OrderRepository orderRepository;

//    @Scheduled(cron = "9 * * * * *")
//    @Transactional
//    public void simulatorDeliveredOrders() {
//        int updatedCount = orderRepository.updateSimulatorOrder(
//                OrderCode.DELIVERED.getValue(),
//                OrderCode.SHIPPING.getValue()
//        );
//        log.info("Simulator  {} orders from SHIPPING to DELIVERED status", updatedCount);
//    }

    //Runs at 24:00 every day
//    @Scheduled(cron = "0 0 0 * * *")
//    @Transactional
//    public void updatePendingOrders() {
//        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
//        int updatedCount = orderRepository.updateOrderStatusForOldOrders(
//                OrderCode.COMPLETED.getValue(),
//                OrderCode.DELIVERED.getValue(),
//                sevenDaysAgo
//        );
//        log.info("Updated {} orders from DELIVERED to COMPLETED status", updatedCount);
//    }
//    @Scheduled(cron = "${app.schedule.task.update-order-status.cron}") // Runs at 1:00 AM every day
//    @Transactional
//    public void updatePendingOrders() {
//        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
//        int updatedCount = orderRepository.updateOrderStatusForOldOrders(
//                OrderCode.COMPLETED.getValue(),
//                OrderCode.DELIVERED.getValue(),
//                sevenDaysAgo
//        );
//        log.info("Updated {} orders from DELIVERED to COMPLETED status", updatedCount);
//    }
}