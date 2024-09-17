package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Feedback;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IFeedbackService {
    Feedback createFeedback(Feedback feedback);
    Feedback updateFeedback(Integer id, Feedback feedback);
    void deleteFeedback(Integer id);
    Feedback getFeedbackById(Integer id);
    List<Feedback> getFeedbacksByProductId(Integer productId);
    List<Feedback> getFeedbacksByUserId(Integer userId);
    Page<Feedback> getAllFeedbacks(int page, int size);
}