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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final OrderRepository orderRepository;
    private final TodoTaskRepository todoTaskRepository;
    private final IEmailService emailService;
    private final IUserService userService;

    @Scheduled(cron = "0 */30 * * * *")  // Chạy mỗi 30 phút
    @Transactional
    public void notificateToCustomer() {
        LocalDateTime now = LocalDateTime.now();

        // Gửi thông báo cho các khoảng thời gian khác nhau
        sendNotificationsForDueRange(now, 7, "Task Due in 7 Days",
                "Reminder: Your task \"%s\" is due in 7 days. Please make sure to complete it on time.");

        sendNotificationsForDueRange(now, 1, "Task Due in 1 Day",
                "Urgent: Your task \"%s\" is due in 1 day. Please make sure to complete it as soon as possible.");
    }

    private void sendNotificationsForDueRange(LocalDateTime now, int days, String subject, String messageTemplate) {
        LocalDateTime endDate = now.plusDays(days);

        List<TodoTask> tasks = todoTaskRepository.findByDueDateRange(now, endDate);
        if (tasks.isEmpty()) {
            return;
        }

        // Nhóm tasks theo userId để tránh query users nhiều lần
        Map<Integer, List<TodoTask>> tasksByUser = tasks.stream()
                .collect(Collectors.groupingBy(TodoTask::getUserId));

        // Xử lý từng user một
        tasksByUser.forEach((userId, userTasks) -> {
            try {
                Users user = userService.getUser(userId);
                userTasks.forEach(task -> {
                    try {
                        String message = String.format(messageTemplate, task.getTitle());
                        emailService.sendMail(user.getEmail(), subject, message);
                    } catch (Exception e) {
                        log.error("Failed to send email for task {} to user {}: {}",
                                task.getId(), userId, e.getMessage());
                    }
                });
            } catch (Exception e) {
                log.error("Failed to process notifications for user {}: {}",
                        userId, e.getMessage());
            }
        });

        log.info("Sent {} notifications for {} tasks due in {} days",
                tasks.size(), tasks.size(), days);
    }
}