package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.pojo.report.BarChart;

import java.time.LocalDate;
import java.util.List;

public interface IDashBoardService {
    List<BarChart> getUserGrowthData(LocalDate startDate, LocalDate endDate);

    List<BarChart> getOrderStatusBreakdown(LocalDate startDate, LocalDate endDate);

    List<BarChart> getTopSellingProducts(LocalDate startDate, LocalDate endDate);

    List<BarChart>  getTotalSales(LocalDate startDate, LocalDate endDate);
}