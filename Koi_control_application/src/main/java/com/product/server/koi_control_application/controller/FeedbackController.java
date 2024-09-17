package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Feedback;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IFeedbackService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_MEMBER", "ROLE_ADMIN", "ROLE_SHOP"})
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<BaseResponse> createFeedback(@RequestBody Feedback feedback) {
        Feedback createdFeedback = feedbackService.createFeedback(feedback);
        BaseResponse response = BaseResponse.builder()
                .data(createdFeedback)
                .statusCode(HttpStatus.CREATED.value())
                .message("Feedback created successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ... other endpoints for update, delete, get feedbacks ...
}