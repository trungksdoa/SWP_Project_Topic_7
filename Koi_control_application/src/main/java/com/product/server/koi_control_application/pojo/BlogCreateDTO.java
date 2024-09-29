package com.product.server.koi_control_application.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Blog creation request")
public class BlogCreateDTO {
    @Schema(description = "Blog header", example = "My First Blog Post")
    private String header;

    @Schema(description = "Blog introduction", example = "This is an introduction to my blog post")
    private String introduction;

    @Schema(description = "Blog body content", example = "This is the main content of my blog post...")
    private String body;

}