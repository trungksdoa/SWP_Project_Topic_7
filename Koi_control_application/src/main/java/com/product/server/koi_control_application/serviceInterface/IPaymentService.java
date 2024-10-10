package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.PaymentStatus;
import com.product.server.koi_control_application.pojo.response.PaymentInfomationResponse;

import java.time.LocalDateTime;
import java.util.List;

/**
 * This interface defines the contract for payment-related operations.
 * It provides methods for creating, retrieving, updating, and clearing payment statuses,
 * as well as obtaining payment gateway URLs.
 */
public interface IPaymentService {

    /**
     * Creates a new payment status.
     *
     * @param paymentStatus The PaymentStatus object to be created.
     */
    void createPaymentStatus(PaymentStatus paymentStatus);

    /**
     * Retrieves all payment statuses.
     *
     * @return A List of PaymentStatus objects.
     */
    List<PaymentStatus> getAllPaymentStatus();

    /**
     * Retrieves all payment information.
     *
     * @return A List of PaymentInfomationResponse objects containing payment details.
     */
    List<PaymentInfomationResponse> getAllPaymentInfo();

    /**
     * Updates the status of a payment.
     *
     * @param referenceId   The reference ID of the payment to update.
     * @param referenceName The name associated with the payment reference.
     * @param paymentStatus The new status to set for the payment.
     */
    void updatePaymentStatus(int referenceId, String referenceName, String paymentStatus);

    /**
     * Updates the status of a payment to indicate failure.
     *
     * @param referenceId   The reference ID of the payment to update.
     * @param referenceName The name associated with the payment reference.
     * @param paymentStatus The new status to set for the payment.
     * @param description   A description of the failure.
     */
    void updatePaymentStatusFail(int referenceId, String referenceName, String paymentStatus, String description);

    /**
     * Clears payment statuses within a specified date range.
     *
     * @param fromDate The start date for clearing payment statuses.
     * @param toDate   The end date for clearing payment statuses.
     */
    void clearPaymentStatusByDate(LocalDateTime fromDate, LocalDateTime toDate);

    /**
     * Retrieves the payment gateway URL for a specific payment reference and user.
     *
     * @param referenceId   The reference ID of the payment.
     * @param referenceName The name associated with the payment reference.
     * @param userId       The ID of the user making the payment.
     * @return             The payment gateway URL as a String.
     */
    String getPaymentGatewayUrl(int referenceId, String referenceName, int userId);
}