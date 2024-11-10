package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.TodoTask;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.repository.TodoTaskRepository;
import com.product.server.koi_control_application.serviceInterface.IEmailService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final OrderRepository orderRepository;
    private final TodoTaskRepository todoTaskRepository;
    private final IEmailService emailService;
    private final IUserService userService;

    @Scheduled(cron = "0 0 8 * * *") // Chạy 1 lần mỗi ngày lúc 8:00
    @Transactional
    public void notificateToCustomer() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysFromNow = now.plusDays(7);
        LocalDateTime oneDayFromNow = now.plusDays(1);

        // Find tasks with due dates within 7 days
        List<TodoTask> tasksDueInSevenDays = todoTaskRepository.findByDueDateRange(now, sevenDaysFromNow);
        if (tasksDueInSevenDays.isEmpty()) {
            log.info("No tasks due in 7 days");
            return;
        }

        for (TodoTask task : tasksDueInSevenDays) {
            Users users = userService.getUser(task.getUserId());
            emailService.sendMail(users.getEmail(), "Task Due in 7 Days", "Reminder: Your task \"" + task.getTitle() + "\" is due in 7 days. Please make sure to complete it on time.");
        }
        log.info("Sent {} emails for tasks due in 7 days", tasksDueInSevenDays.size());

        // Find tasks with due dates within 1 day
        List<TodoTask> tasksDueInOneDay = todoTaskRepository.findByDueDateRange(now, oneDayFromNow);
        if (tasksDueInOneDay.isEmpty()) {
            log.info("No tasks due in 1 day");
            return;
        }
        for (TodoTask task : tasksDueInOneDay) {
            Users users = userService.getUser(task.getUserId());
            emailService.sendMail(users.getEmail(), "Task Due in 1 Day", "Urgent: Your task \"" + task.getTitle() + "\" is due in 1 day. Please make sure to complete it as soon as possible.");
        }
        log.info("Sent {} emails for tasks due in 1 day", tasksDueInOneDay.size());
    }

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