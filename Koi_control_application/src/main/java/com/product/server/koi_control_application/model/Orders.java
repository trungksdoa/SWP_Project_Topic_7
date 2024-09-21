package com.product.server.koi_control_application.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
@EntityListeners(AuditingEntityListener.class)
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String fullName;
    private String address;
    private String phone;

    @Column(name = "users_id", nullable = false)
    private int userId;

    private int totalAmount;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(nullable = false)
    private String status;

    @Column(nullable = true)
    private String paymentMethod;

    @Column(nullable = true)
    private String shippingStatus;

    @ManyToMany
    @JoinTable(
            name = "orders_items",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    @JsonIgnoreProperties("order")
    private Set<OrderItems> items = new HashSet<>();


    private String responseFromAdmin;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
