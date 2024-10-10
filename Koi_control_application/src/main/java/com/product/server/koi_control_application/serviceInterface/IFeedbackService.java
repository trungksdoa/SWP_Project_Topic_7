package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * This interface defines the contract for feedback-related operations.
 * It provides methods for creating, retrieving, updating, and deleting feedback,
 * as well as retrieving feedback by product and user IDs.
 */
public interface IFeedbackService {

    /**
     * Creates a new feedback entry.
     *
     * @param feedback The Feedback object to be created.
     * @return        The created Feedback object.
     */
    Feedback createFeedback(Users user, Product product, FeedbackDTO feedback);

    /**
     * Retrieves all feedback entries.
     *
     * @return A List of all Feedback objects.
     */
    List<Feedback> getAll();

    /**
     * Updates an existing feedback entry.
     *
     * @param id       The ID of the feedback to update.
     * @param feedback The Feedback object containing updated details.
     * @return        The updated Feedback object.
     */
    Feedback updateFeedback(Integer id, Feedback feedback);

    /**
     * Deletes a feedback entry by its ID.
     *
     * @param id The ID of the feedback to delete.
     */
    void deleteFeedback(Integer id);

    /**
     * Retrieves a feedback entry by its ID.
     *
     * @param id The ID of the feedback to retrieve.
     * @return   The Feedback object corresponding to the provided ID.
     */
    Feedback getFeedbackById(Integer id);

    /**
     * Retrieves all feedback entries for a specific product.
     *
     * @param productId The ID of the product whose feedback to retrieve.
     * @return         A List of Feedback objects for the specified product.
     */
    List<Feedback> getFeedbacksByProductId(Integer productId);

    /**
     * Retrieves all feedback entries for a specific user.
     *
     * @param userId The ID of the user whose feedback to retrieve.
     * @return      A List of Feedback objects for the specified user.
     */
    List<Feedback> getFeedbacksByUserId(Integer userId);

    /**
     * Retrieves a paginated list of all feedback entries.
     *
     * @param page The page number to retrieve.
     * @param size The number of feedback entries per page.
     * @return     A Page containing the list of Feedback objects.
     */
    Page<Feedback> getAllFeedbacks(int page, int size);
}