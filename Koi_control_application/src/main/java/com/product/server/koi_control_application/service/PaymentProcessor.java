package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.enums.OrderCode;
import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.momo.MomoCallbackResponse;
import com.product.server.koi_control_application.pojo.momo.PaymentContext;
import com.product.server.koi_control_application.serviceInterface.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static com.product.server.koi_control_application.enums.PaymentCode.FAILED;
import static com.product.server.koi_control_application.enums.PaymentCode.PAID;

@RequiredArgsConstructor
@Slf4j
@Service
public class PaymentProcessor {
    private final IOrderService orderService;
    private final IUserService userService;
    private final ICartService cartService;
    private final IPaymentService paymentService;
    private final IEmailService emailService;
    public void processCallback(MomoCallbackResponse response) {
        PaymentContext context = PaymentContext.fromCallback(response);

        try {
            if (response.getResultCode() == 0) {
                handleSuccessfulPayment(context);
            } else {
                handleFailedPayment(context);
            }
        } catch (Exception ex) {
            log.error("Error processing payment callback: {}", ex.getMessage());
            handlePaymentError(context);
        }
    }

    private void handlePaymentError(PaymentContext context) {
        log.error("Error processing payment for order {} of user {}", context.getOrderId(), context.getUserId());
    }

    private void handleFailedPayment(PaymentContext context) {
        if (context.isProductOrder()) {
            orderService.updateOrderStatus(Integer.parseInt(context.getOrderId()), OrderCode.CANCELLED.getValue());
            log.info("Order {} has been canceled", context.getOrderId());
        } else {
            log.info("User {} has failed to add package", context.getUserId());
        }

        paymentService.updatePaymentStatus(Integer.parseInt(context.getOrderId()), context.getOrderType(), FAILED.getValue());
    }

    private void handleSuccessfulPayment(PaymentContext context) {
        if (context.isProductOrder()) {
            processProductPayment(context);
        } else {
            processPackagePayment(context);
        }
    }

    private void processPackagePayment(PaymentContext context) {
        // Handle package addition for the user
        UserPackage userPackage = new UserPackage();
        userPackage.setId(Integer.parseInt(context.getOrderId()));

        userService.addPackage(Integer.parseInt(context.getUserId()), userPackage);
        emailService.sendMail(context.getUserId(), "Upgrade package", "Your package has been upgraded successfully. Go to the website to view changes: https://swp-project-topic-7.vercel.app/packages");
        log.info("User {} has been added package successfully", context.getUserId());        log.info("User {} has been added package successfully", context.getUserId());
    }

    private void processProductPayment(PaymentContext context) {
        // If the order is already marked as paid, return
        if (orderService.getOrderById(Integer.parseInt(context.getOrderId())).getStatus().equals(OrderCode.SUCCESS.getValue())) {
            return;
        }

        /*
         * Update the payment status to PAID
         */

        paymentService.updatePaymentStatus(Integer.parseInt(context.getOrderId()), context.getOrderType(), PAID.getValue());
        /*
         * Update the order status to PAID
         */

        orderService.updateOrderStatus(Integer.parseInt(context.getOrderId()), OrderCode.SUCCESS.getValue());
        /*
         * Clear the cart
         */
        cartService.clearCart(Integer.parseInt(context.getUserId()));
        log.info("Order {} has been paid successfully", context.getOrderId());
    }

    // ... other private methods
}