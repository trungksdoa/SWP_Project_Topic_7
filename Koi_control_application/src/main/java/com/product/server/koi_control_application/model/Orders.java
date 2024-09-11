package com.product.server.koi_control_application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    @Column(nullable = false)
    private int totalAmount;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(nullable = false)
    private String status;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
