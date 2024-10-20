package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.pojo.OrderReport;
import com.product.server.koi_control_application.pojo.UserReport;
import com.product.server.koi_control_application.pojo.report.BarChart;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IDashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService  implements IDashBoardService {
    private final UsersRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public List<BarChart> getUserGrowthData(LocalDate fromDate, LocalDate toDate) {
        LocalDateTime startDateTime = LocalDateTime.of(fromDate, LocalTime.MIN);
        LocalDateTime endDateTime = LocalDateTime.of(toDate, LocalTime.MAX);

        return userRepository.getRecentUserGrowthData(startDateTime, endDateTime);
    }

    @Override
    public List<BarChart> getOrderStatusBreakdown(LocalDate fromDate, LocalDate toDate) {
        LocalDateTime startDateTime = LocalDateTime.of(fromDate, LocalTime.MIN);
        LocalDateTime endDateTime = LocalDateTime.of(toDate, LocalTime.MAX);

        return orderRepository.getOrdersStatusByDateRange(startDateTime, endDateTime);
    }

    @Override
    public List<BarChart> getTopSellingProducts(int limit, LocalDate fromDate, LocalDate toDate) {
        LocalDateTime startDateTime = LocalDateTime.of(fromDate, LocalTime.MIN);
        LocalDateTime endDateTime = LocalDateTime.of(toDate, LocalTime.MAX);

        return productRepository.getTopSellingProductsByDateRange(limit, startDateTime, endDateTime);
    }
}
