package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.pojo.report.BarChart;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IDashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService  implements IDashBoardService {
    private final UsersRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;


    @Override
    public List<BarChart> getUserGrowthData(LocalDate startDate, LocalDate endDate) {
        return userRepository.getRecentUserGrowthData(startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
    }

    @Override
    public List<BarChart> getOrderStatusBreakdown(LocalDate startDate, LocalDate endDate) {
        return orderRepository.getOrdersStatusByDateRange(startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
    }

    @Override
    public List<BarChart> getTopSellingProducts(LocalDate startDate, LocalDate endDate) {
        return productRepository.getTopSellingProductsByDateRange(startDate.atStartOfDay(), endDate.atTime(LocalTime.MAX));
    }

    @Override
    public List<BarChart>  getTotalSales(LocalDate startDate, LocalDate endDate) {
        return orderRepository.getTotalSalesByDate(startDate.atStartOfDay(),endDate.atTime(LocalTime.MAX));
    }

}
