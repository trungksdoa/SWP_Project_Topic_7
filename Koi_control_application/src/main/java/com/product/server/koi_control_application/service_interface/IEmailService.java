package com.product.server.koi_control_application.service_interface;

/**
 * This interface defines the contract for email-related operations.
 * It provides methods for sending emails, including sending a password reset email.
 */
public interface IEmailService {

    /**
     * Sends an email with the specified subject and text.
     *
     * @param to      The recipient's email address.
     * @param subject The subject of the email.
     * @param text    The body text of the email.
     */
    void sendMail(String to, String subject, String text);

    /**
     * Sends a new password to the specified email address.
     *
     * @param email      The email address to which the new password will be sent.
     * @param newPassword The new password to be sent.
     */
    void sendPasswordToEmail(String email, String newPassword);
}