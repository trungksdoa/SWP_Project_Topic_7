package com.product.server.koi_control_application;

import com.product.server.koi_control_application.pojo.UserReport;
import com.product.server.koi_control_application.repository.OrderRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class reportTesting {
    private static final Logger logger = LoggerFactory.getLogger(reportTesting.class);

    @Mock
    private UsersRepository userRepository;

    private DashboardService dashboardService;
    private OrderRepository orderRepository;
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dashboardService = new DashboardService(userRepository, orderRepository, productRepository);
    }

    @Test
    void testUserGrowthData() {
        LocalDate fromDate = LocalDate.of(2023, 10, 1);
        LocalDate toDate = LocalDate.of(2023, 10, 5);

//        List<UserReport> mockData = Arrays.asList(
//                new UserReport("2023-10-01", 5),
//                new UserReport("2023-10-02", 3),
//                new UserReport("2023-10-03", 7),
//                new UserReport("2023-10-04", 2),
//                new UserReport("2023-10-05", 4)
//        );
//
//        // Verify that the repository method is called with the correct date range
//        when(userRepository.getRecentUserGrowthData(
//                eq(LocalDateTime.of(fromDate, LocalTime.MIN)),
//                eq(LocalDateTime.of(toDate, LocalTime.MAX))
//        )).thenReturn(mockData);
//
//        List<UserReport> result = dashboardService.getUserGrowthData(fromDate, toDate);
//
//        // Verify the result
//        assertEquals(5, result.size());
//        assertEquals("2023-10-01", result.get(0).getDate());
//        assertEquals(5, result.get(0).getNewUsers());
//        assertEquals("2023-10-05", result.get(4).getDate());
//        assertEquals(4, result.get(4).getNewUsers());
//
//        // Verify that the repository method was called exactly once with the correct parameters
//        verify(userRepository, times(1)).getRecentUserGrowthData(
//                eq(LocalDateTime.of(fromDate, LocalTime.MIN)),
//                eq(LocalDateTime.of(toDate, LocalTime.MAX))
//        );
    }
}
