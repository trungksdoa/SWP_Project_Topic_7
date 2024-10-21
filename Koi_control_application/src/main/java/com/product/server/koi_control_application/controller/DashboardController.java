package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IDashBoardService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "Dashboard", description = "APIs for dashboard data")
public class DashboardController {

    private final IDashBoardService dashboardService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    @GetMapping("/user-growth")
    @Operation(summary = "Get user growth data", description = "Retrieves data for user growth chart")
    public ResponseEntity<BaseResponse> getUserGrowth(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate parsedStartDate = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate parsedEndDate = LocalDate.parse(endDate, DATE_FORMATTER);
        return ResponseUtil.createSuccessResponse(dashboardService.getUserGrowthData(parsedStartDate, parsedEndDate), "User growth data retrieved successfully");
    }

    //Chart type: Pie Chart or Donut Chart
    @GetMapping("/order-status")
    @Operation(summary = "Get order status breakdown", description = "Retrieves data for order status breakdown chart")
    public ResponseEntity<BaseResponse> getOrderStatusBreakdown(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate parsedStartDate = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate parsedEndDate = LocalDate.parse(endDate, DATE_FORMATTER);
        return ResponseUtil.createSuccessResponse(dashboardService.getOrderStatusBreakdown(parsedStartDate, parsedEndDate), "Order status breakdown retrieved successfully");
    }

    @GetMapping("/top-selling-products")
    @Operation(summary = "Get top-selling products", description = "Retrieves data for top-selling products")
    public ResponseEntity<BaseResponse> getTopSellingProducts(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate parsedStartDate = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate parsedEndDate = LocalDate.parse(endDate, DATE_FORMATTER);
        return ResponseUtil.createSuccessResponse(dashboardService.getTopSellingProducts(parsedStartDate, parsedEndDate), "Top-selling products retrieved successfully");
    }

    @GetMapping("/total-sales")
    @Operation(summary = "Get total sales", description = "Retrieves total sales data")
    public ResponseEntity<BaseResponse> getTotalSales(@RequestParam String startDate,
                                                      @RequestParam String endDate) {
        LocalDate parsedStartDate = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate parsedEndDate = LocalDate.parse(endDate, DATE_FORMATTER);
        return ResponseUtil.createSuccessResponse(dashboardService.getTotalSales(parsedStartDate,parsedEndDate), "Total sales data retrieved successfully");
    }
}