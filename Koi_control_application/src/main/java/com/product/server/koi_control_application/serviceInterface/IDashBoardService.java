package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.pojo.OrderReport;
import com.product.server.koi_control_application.pojo.UserReport;
import com.product.server.koi_control_application.pojo.report.BarChart;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IDashBoardService {
    List<BarChart> getUserGrowthData(LocalDate startDate, LocalDate endDate);
    List<BarChart> getOrderStatusBreakdown();
    List<BarChart> getTopSellingProducts(int limit);
}
