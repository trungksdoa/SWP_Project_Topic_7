package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.pojo.FeedbackRequest;
import com.product.server.koi_control_application.service_interface.IFeedbackService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_MEMBER", "ROLE_ADMIN", "ROLE_SHOP"})
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<BaseResponse> createFeedback(@RequestBody FeedbackRequest feedback) {
        Users users = Users.builder().id(feedback.getUserId()).build();
        Product product = Product.builder().id(feedback.getProductId()).build();
        Feedback createdFeedback = feedbackService.createFeedback(Feedback.builder()
                .user(users)
                .product(product)
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .build());
        BaseResponse response = BaseResponse.builder()
                .data(createdFeedback)
                .statusCode(HttpStatus.CREATED.value())
                .message("Feedback created successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAll(){
        return new ResponseEntity<>(feedbackService.getAll(), HttpStatus.CREATED);
    }

    // ... other endpoints for update, delete, get feedbacks ...
}