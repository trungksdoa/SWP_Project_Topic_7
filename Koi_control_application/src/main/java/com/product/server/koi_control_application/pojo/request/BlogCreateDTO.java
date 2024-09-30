package com.product.server.koi_control_application.pojo.request;

import com.product.server.koi_control_application.model.Users;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Blog creation request")
public class BlogCreateDTO {
    @Schema(description = "Title of the blog", example = "This is a blog title")
    private String title;

    @Schema(description = "Header of the top blog", example = "This is a blog header")
    private String headerTop;
    @Schema(description = "Content of the top blog", example = "This is a blog content")
    private String contentTop;

    @Schema(description = "Header of the middle blog", example = "This is a blog header")
    private String headerMiddle;
    @Schema(description = "Content of the middle blog", example = "This is a blog content")
    private String contentMiddle;
}