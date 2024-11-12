package com.product.server.koi_control_application.model;


import com.product.server.koi_control_application.enums.TodoPriority;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank(message = "title is required")
    @Size(max = 50, message = "title must be less than 50 characters")
    private String title;
    @NotBlank(message = "description is required")
    @Size(max = 100, message = "description must be less than 100 characters")
    private String description;
    @NotBlank(message = "priority is required")
    private TodoPriority priority;
    @NotBlank(message = "status is required")
    private String status;
    @NotBlank(message = "dueDate is required")
    private LocalDateTime dueDate;
    @Column(name = "user_id")
    private int userId;

    private String taskType;

    private int placeIndex;


    @Column(name = "completed_at", updatable = false)
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.status = "ongoing";
    }

}
