package com.product.server.koi_control_application.model;


import com.product.server.koi_control_application.pojo.SlugGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Blogs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(unique = true)
    private String title;

    @Column(columnDefinition = "TEXT")
    @Size(min = 20)
    private String headerTop;
    @Column(columnDefinition = "TEXT")
    private String contentTop;

    @Column(columnDefinition = "TEXT")
    private String headerMiddle;
    @Column(columnDefinition = "TEXT")
    private String contentMiddle;

    private String headerImageUrl;
    private String bodyImageUrl;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Users author;

    private boolean status;

    private String slug;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (this.slug == null || this.slug.isEmpty()) {
            this.slug = SlugGenerator.toSlug(this.title);
        }
    }
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
