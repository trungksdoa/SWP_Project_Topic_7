package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import com.product.server.koi_control_application.repository.FeedbackRepository;
import com.product.server.koi_control_application.serviceInterface.IFeedbackService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackServiceImpl implements IFeedbackService {
    private final FeedbackRepository feedbackRepository;

    @Override
    @Transactional
    public Feedback createFeedback(Users user, Product product, FeedbackDTO feedback) {
        if(findByOrderId(feedback.getOrderId()).isPresent()) {
            throw new BadRequestException("Feedback already exists for order with id: " + feedback.getOrderId());
        }

        try {
            log.info("Creating feedback for product with id: {}", product.getId());
            return feedbackRepository.save(Feedback.builder()
                    .user(user)
                    .product(product)
                    .rating(feedback.getRating())
                    .comment(feedback.getComment())
                    .orderId(feedback.getOrderId())
                    .build());
        } catch (Exception e) {
            throw new NotFoundException("Product or User not found");
        }
    }

    @Override
    public List<Feedback> getAll() {
        return feedbackRepository.findAll();
    }

    @Override
    public Feedback updateFeedback(FeedbackDTO feedback) {

        if (findFeedbackById(feedback.getId()) == null) {
            throw new NotFoundException("Feedback not found with id: " + feedback.getId());
        }
        Feedback fed = findFeedbackById(feedback.getId());

        Optional.ofNullable(feedback.getRating()).ifPresent(fed::setRating);
        Optional.ofNullable(feedback.getComment()).ifPresent(fed::setComment);
        log.info("Updating feedback with id: {}", feedback.getId());

        return feedbackRepository.save(fed);
    }


    @Override
    public List<Feedback> getFeedbacksByProductId(Integer productId) {
        return feedbackRepository.findByProduct_Id(productId);
    }

    @Override
    public List<Feedback> getFeedbacksByUserId(Integer userId) {
        return feedbackRepository.findByUser_Id(userId);
    }


    private Feedback findFeedbackById(Integer id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Feedback not found with id: " + id));
    }

    private Optional<Feedback> findByOrderId(int orderId) {
        return feedbackRepository.findByOrderId(orderId);
    }
    // ... other methods implementation ...
}