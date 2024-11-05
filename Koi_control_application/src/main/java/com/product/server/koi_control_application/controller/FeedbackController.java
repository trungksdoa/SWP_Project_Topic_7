package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.FeedbackDTO;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IFeedbackService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.FeedbackMappings.BASE_FEEDBACK;
import static com.product.server.koi_control_application.mappingInterface.FeedbackMappings.GET_FEEDBACKS_BY_PRODUCT;

@RestController
@RequestMapping(BASE_FEEDBACK)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Feedback", description = "APIs for managing feedbacks")
public class FeedbackController {
    private final IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<BaseResponse> createFeedback( @Valid @RequestBody FeedbackDTO feedback) {
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

    @GetMapping(GET_FEEDBACKS_BY_PRODUCT)
    public ResponseEntity<BaseResponse> getByProduct(@PathVariable int productId) {
        return ResponseUtil.createSuccessResponse(feedbackService.getFeedbacksByProductId(productId), "Feedbacks retrieved successfully by product " + productId);
    }

    @PutMapping()
    public ResponseEntity<BaseResponse> updateFeedback(@Valid @RequestBody FeedbackDTO feedback) {
        return ResponseUtil.createResponse(
                feedbackService.updateFeedback(feedback),
                "Feedback updated successfully",
                HttpStatus.OK);
    }

    // ... other endpoints for update, delete, get feedbacks ...
}