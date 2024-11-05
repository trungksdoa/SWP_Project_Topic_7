package com.product.server.koi_control_application.pojo.request;


import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
    private int id;
    private int userId;
    private int productId;
    @Size(min = 1, max = 5, message = "Rating must be between 1 and 5")
    private Integer rating;
    private int orderId;
    @Size(max = 1000, message = "Comment must be less than 1000 characters")
    private String comment;
}
