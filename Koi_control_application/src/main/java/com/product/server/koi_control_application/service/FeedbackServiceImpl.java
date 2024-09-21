package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.FeedbackRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service_interface.IFeedbackService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements IFeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;
    private final UsersRepository usersRepository;

    @Override
    @Transactional
    public Feedback createFeedback(Feedback feedback) {
        Users user = usersRepository.findById(feedback.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(feedback.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        feedback.setUser(user);
        feedback.setProduct(product);
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());

        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        product.calculateAverageRating();
        productRepository.save(product);
        return feedbackRepository.save(feedback);
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
    public void deleteFeedback(Integer id) {

        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Feedback getFeedbackById(Integer id) {
        return null;
    }

    @Override
    public List<Feedback> getFeedbacksByProductId(Integer productId) {
        return null;
    }

    @Override
    public List<Feedback> getFeedbacksByUserId(Integer userId) {
        return null;
    }

    @Override
    public Page<Feedback> getAllFeedbacks(int page, int size) {
        return null;
    }

    // ... other methods implementation ...
}