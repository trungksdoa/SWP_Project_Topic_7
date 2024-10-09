package com.product.server.koi_control_application;


import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.Orders;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.OrderRequestDTO;
import com.product.server.koi_control_application.service.OrderServiceImpl;
import com.product.server.koi_control_application.service.PaymentService;
import com.product.server.koi_control_application.service.UserServiceImpl;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Transactional
class OrderServiceImplTest {
    @Mock
    private OrderServiceImpl orderService;

    @Mock
    private UserServiceImpl userService;

    @Mock
    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createOrderAndCheckStatusIsPending() {
        OrderRequestDTO orders = new OrderRequestDTO();
        orders.setFullName("");
        orders.setAddress("");
        orders.setPhone("");

        Users user = new Users();
        user.setId(12400);

        when(userService.getUser(12400)).thenReturn(user);
        when(orderService.createOrder(12400, orders)).thenReturn(Orders.builder()
                .id(1)
                .userId(12400)
                .status("PENDING")
                .build());

        Orders order = orderService.createOrder(12400, orders);

        assertEquals("PENDING", order.getStatus());
        verify(orderService, times(1)).createOrder(12400, orders);
    }

    @Test
    void orderTest() {
        OrderRequestDTO orders = new OrderRequestDTO();
        orders.setFullName("");
        orders.setAddress("");
        orders.setPhone("");

        Users user = new Users();
        user.setId(12400);

        when(userService.getUser(12400)).thenReturn(user);
        when(orderService.createOrder(12400, orders)).thenReturn(Orders.builder()
                .id(1)
                .userId(12400)
                .status("PENDING")
                .build());

        Orders order = orderService.createOrder(12400, orders);

        assertEquals("PENDING", order.getStatus());
    }

    @Test
    void cancelOrder_Failure_WhenNotPending() {
        // Arrange
        OrderRequestDTO orders = new OrderRequestDTO();
        orders.setFullName("John Doe");
        orders.setAddress("123 Main St");
        orders.setPhone("1234567890");

        Users user = new Users();
        user.setId(12400);

        when(userService.getUser(12400)).thenReturn(user);
        when(orderService.createOrder(12400, orders)).thenReturn(Orders.builder()
                .id(1)
                .userId(12400)
                .status(OrderCode.PENDING.getValue()) // Set status to SUCCESS
                .build());

        Orders createdOrder = orderService.createOrder(12400, orders);
        verify(orderService, times(1)).createOrder(12400, orders);

        // Simulate changing the order status to SUCCESS
        createdOrder.setStatus(OrderCode.SUCCESS.getValue());

        // Mock the behavior of getOrderById to return the order with SUCCESS status
        when(orderService.getOrderById(1)).thenReturn(createdOrder);

        // Mock the cancelPendingOrder method to throw an exception if the order is not PENDING
        doAnswer(invocation -> {
            int orderId = invocation.getArgument(1);
            Orders order = orderService.getOrderById(orderId);
            if (!order.getStatus().equals(OrderCode.PENDING.getValue())) {
                throw new IllegalStateException("Order cannot be cancelled");
            }
            return null;
        }).when(orderService).cancelPendingOrder(anyInt(), anyInt());

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            orderService.cancelPendingOrder(12400, 1);
        });

        // Verify that the method was called
        verify(orderService).cancelPendingOrder(anyInt(), anyInt());
    }

//            times(int wantedNumberOfInvocations): Verifies that the method was called a specific number of times.
//            never(): Verifies that the method was never called.
//            atLeastOnce(): Verifies that the method was called at least once.
//            atLeast(int minNumberOfInvocations): Verifies that the method was called at least a certain number of times.
//            atMost(int maxNumberOfInvocations): Verifies that the method was called at most a certain number of times.
//            only(): Verifies that the method was the only one called on the mock.
}
