//package com.product.server.koi_control_application.service;
//
//import com.product.server.koi_control_application.model.Feedback;
//import com.product.server.koi_control_application.model.Product;
//import com.product.server.koi_control_application.model.Users;
//import com.product.server.koi_control_application.repository.FeedbackRepository;
//import com.product.server.koi_control_application.repository.ProductRepository;
//import com.product.server.koi_control_application.repository.UsersRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//public class FeedBackServiceImpl implements IFeedbackService {
//    private final FeedbackRepository feedbackRepository;
//    private final ProductRepository productRepository;
//    private final UsersRepository usersRepository;
//
//    @Override
//    @Transactional
//    public Feedback createFeedback(Feedback feedback) {
//        // Validate user
//        Users user = usersRepository.findById(feedback.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Validate product
//        Product product = productRepository.findById(feedback.getProductId())
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        // Set creation time
//        feedback.setCreatedAt(LocalDateTime.now());
//        feedback.setUpdatedAt(LocalDateTime.now());
//
//        // Validate rating
//        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
//            throw new IllegalArgumentException("Rating must be between 1 and 5");
//        }
//
//        return feedbackRepository.save(feedback);
//    }
//
//    @Override
//    public void updateFeedback(Feedback fb) {
//
//    }
//
//    @Override
//    public void deleteFeedback(int userId) {
//
//    }
//
//    @Override
//    public void getFeedback(int userId) {
//
//    }
//
//    @Override
//    public void getAllFeedbacks() {
//
//    }
//
//    // ... other methods remain the same
//
////    @Override
////    public Page<Feedback> getFeedbacksByProduct(int productId, int page, int size) {
////        // Validate product
////        productRepository.findById(productId)
////                .orElseThrow(() -> new RuntimeException("Product not found"));
////
////        return feedbackRepository.findByProductId(productId, PageRequest.of(page, size));
////    }
//}