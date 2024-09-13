package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Feedback;

public interface IFeedbackService {
    Feedback createFeedback(Feedback fb);
    void updateFeedback(Feedback fb);
    void deleteFeedback(int userId);
    void getFeedback(int userId);
    void getAllFeedbacks();
}
