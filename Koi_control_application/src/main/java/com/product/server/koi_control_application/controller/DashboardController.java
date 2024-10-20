package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IDashBoardService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "Dashboard", description = "APIs for dashboard data")
public class DashboardController {

    private final IDashBoardService dashboardService;

    @GetMapping("/user-growth")
    @Operation(summary = "Get user growth data", description = "Retrieves data for user growth chart")
    public ResponseEntity<BaseResponse> getUserGrowth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // The x-axis would represent the dates, and the y-axis would show the number of new user registrations for each day.
        return ResponseUtil.createSuccessResponse(dashboardService.getUserGrowthData(startDate, endDate), "User growth data retrieved successfully");
    }

    //Chart type: Pie Chart or Donut Chart
    @GetMapping("/order-status")
    @Operation(summary = "Get order status breakdown", description = "Retrieves data for order status breakdown chart")
    public ResponseEntity<BaseResponse> getOrderStatusBreakdown() {
        return ResponseUtil.createSuccessResponse(dashboardService.getOrderStatusBreakdown(), "Order status breakdown retrieved successfully");
    }

    //Chart type: Bar Chart

    @GetMapping("/top-selling-products")
    @Operation(summary = "Get top-selling products", description = "Retrieves data for top-selling products")
    public ResponseEntity<BaseResponse> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseUtil.createSuccessResponse(dashboardService.getTopSellingProducts(limit), "Top-selling products retrieved successfully");
    }
}