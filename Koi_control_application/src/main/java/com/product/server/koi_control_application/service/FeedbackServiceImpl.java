package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import com.product.server.koi_control_application.repository.FeedbackRepository;
import com.product.server.koi_control_application.service_interface.IFeedbackService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackServiceImpl implements IFeedbackService {
    private final FeedbackRepository feedbackRepository;

    @Override
    @Transactional
    public Feedback createFeedback(Users user, Product product, FeedbackDTO feedback) {
       try{
           log.info("Creating feedback for product with id: {}", product.getId());
           return feedbackRepository.save(Feedback.builder()
                   .user(user)
                   .product(product)
                   .rating(feedback.getRating())
                   .comment(feedback.getComment())
                   .build());
       }catch (Exception e){
           throw new NotFoundException("Product or User not found");
       }
    }

    @Override
    public List<Feedback> getAll() {
        return feedbackRepository.findAll();
    }

    @Override
    public Feedback updateFeedback(Integer id, Feedback feedback) {
        return null;
    }

    @Override
    @Transactional
    public void deleteFeedback(Integer id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Feedback getFeedbackById(Integer id) {
        return null;
    }

    @Override
    public List<Feedback> getFeedbacksByProductId(Integer productId) {
        return feedbackRepository.findByProduct_Id(productId);
    }

    @Override
    public List<Feedback> getFeedbacksByUserId(Integer userId) {
        return feedbackRepository.findByUser_Id(userId);
    }

    @Override
    public Page<Feedback> getAllFeedbacks(int page, int size) {
        return null;
    }

    // ... other methods implementation ...
}