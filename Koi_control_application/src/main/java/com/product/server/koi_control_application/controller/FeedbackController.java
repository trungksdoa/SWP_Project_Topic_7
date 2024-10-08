package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service_interface.IFeedbackService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Feedback", description = "APIs for managing feedbacks")
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<BaseResponse> createFeedback(@RequestBody FeedbackDTO feedback) {
        Users users = Users.builder().id(feedback.getUserId()).build();
        Product product = Product.builder().id(feedback.getProductId()).build();

        return ResponseUtil.createResponse(
                feedbackService.createFeedback(users, product, feedback),
                "Feedback created successfully",
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getAll() {
        return ResponseUtil.createSuccessResponse(feedbackService.getAll(), "fetch data success");
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<BaseResponse> getByProduct(@PathVariable int productId) {
        return ResponseUtil.createSuccessResponse(feedbackService.getFeedbacksByProductId(productId), "Feedbacks retrieved successfully by product " + productId);
    }


    // ... other endpoints for update, delete, get feedbacks ...
}