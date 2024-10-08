package com.product.server.koi_control_application;

import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import com.product.server.koi_control_application.repository.FeedbackRepository;
import com.product.server.koi_control_application.service.FeedbackServiceImpl;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@Transactional
class FeedbackServiceImplTest {

    @Mock
    private FeedbackRepository feedbackRepository;


    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        feedbackService = new FeedbackServiceImpl(feedbackRepository);
    }

    @Test
    void createFeedback() {
        Users user = new Users();
        user.setId(34);
        Product product = new Product();
        product.setId(56);

        FeedbackDTO feedback = new FeedbackDTO();
        feedback.setUserId(user.getId());
        feedback.setProductId(product.getId());
        feedback.setRating(4);
        feedback.setComment("Great product!");
        // Mock repository responses
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(Feedback.builder()
                .user(user)
                .product(product)
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .build());

        // Call the service method
        Feedback result = feedbackService.createFeedback(user, product, feedback);

        // Assertions
        assertNotNull(result);
        assertEquals(4, result.getRating());
        assertEquals("Great product!", result.getComment());
        assertEquals(user, result.getUser());
        assertEquals(product, result.getProduct());


        verify(feedbackRepository).save(any(Feedback.class));
    }

    @Test
    void getFeedbacksByProductId() {
        int productId = 42;
        List<Feedback> feedbackList = Arrays.asList(new Feedback(), new Feedback());

        when(feedbackRepository.findByProduct_Id(productId)).thenReturn(feedbackList);

        List<Feedback> result = feedbackService.getFeedbacksByProductId(productId);

        assertEquals(2, result.size());
        verify(feedbackRepository).findByProduct_Id(productId);
    }

    @Test
    void getFeedbacksByUserId() {
        List<Feedback> feedbackList = Arrays.asList(new Feedback(), new Feedback());

        when(feedbackRepository.findByUser_Id(34)).thenReturn(feedbackList);

        List<Feedback> result = feedbackService.getFeedbacksByUserId(34);

        assertEquals(2, result.size());
        verify(feedbackRepository).findByUser_Id(34);
    }
}