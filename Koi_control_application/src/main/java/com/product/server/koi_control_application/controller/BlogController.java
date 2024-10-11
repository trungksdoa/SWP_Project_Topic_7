package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.request.BlogCreateDTO;
import com.product.server.koi_control_application.pojo.request.BlogRequestApprove;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IBlogService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.JwtTokenUtil;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.product.server.koi_control_application.mappingInterface.BlogMappings.*;

@RestController
@RequestMapping(BASE_BLOG)
@RequiredArgsConstructor
@Tag(name = "Blog", description = "API for blog")
public class BlogController {
    private final IBlogService blogService;
    private final JwtTokenUtil jwtUtil;
    private final IUserService userService;
    @GetMapping
    public ResponseEntity<BaseResponse> getAllBlogs() {
        return ResponseUtil.createSuccessResponse(blogService.getAllBlogs(), "Success");
    }

    @GetMapping(GET_BLOG_BY_ID)
    public ResponseEntity<BaseResponse> getBlogById(@PathVariable int blogId) {
        return ResponseUtil.createSuccessResponse(blogService.getBlogById(blogId), "Success");
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SHOP')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createBlog(
            @RequestPart("blog") @Schema(type = "string", format = "json", implementation = BlogCreateDTO.class) String blogJson,
            @RequestParam(value = "headerImage", required = false) MultipartFile headerImage,
            @RequestParam(value = "bodyImage", required = false) MultipartFile bodyImage,
            HttpServletRequest request
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        int userId = jwtUtil.getUserIdFromToken(request);
        Blogs blog = mapper.readValue(blogJson, Blogs.class);
        Users author = userService.getUser(userId);
        blog.setAuthor(author);
        return ResponseUtil.createResponse(blogService.createBlog(blog, headerImage, bodyImage),
                "Created blog successfully",
                HttpStatus.CREATED);
    }


    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SHOP')")
    @PutMapping(value = UPDATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> updateBlog(
            @PathVariable int updateBlogId,
            @RequestPart("blog") @Schema(type = "string", format = "json", implementation = BlogCreateDTO.class) String blogJson,
            @RequestPart(value = "headerImage", required = false) MultipartFile headerImage,
            @RequestPart(value = "bodyImage", required = false) MultipartFile bodyImage) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        @Valid Blogs blog = mapper.readValue(blogJson, Blogs.class);
        return ResponseUtil.createResponse(blogService.updateBlog(updateBlogId, blog, headerImage, bodyImage), "Created blog successfully", HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SHOP')")
    @DeleteMapping(DELETE_BLOG)
    public ResponseEntity<BaseResponse> deleteBlog(@PathVariable int deleteBlogId) {
        blogService.deleteBlog(deleteBlogId);
        return ResponseUtil.createSuccessResponse(null, "Deleted blog successfully");
    }

    @GetMapping(GET_BLOG_BY_SLUG)
    public ResponseEntity<BaseResponse> getBlogBySlug(@PathVariable String slug) {
        return ResponseUtil.createSuccessResponse(blogService.getBlogBySlug(slug), "Get blog by slug successfully");
    }

    @GetMapping(GET_BLOG_BY_AUTHOR)
    public ResponseEntity<BaseResponse> getBlogsByAuthor(@PathVariable int authorId) {
        return ResponseUtil.createSuccessResponse(blogService.getBlogsByAuthor(authorId), "Retrieved blogs successfully");
    }


    @GetMapping(SEARCH_BLOG)
    public ResponseEntity<BaseResponse> searchBlog(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String headerTop,
            @RequestParam(required = false) String headerMiddle) {
        return ResponseUtil.createSuccessResponse(blogService.searchBlogs(title, headerTop, headerMiddle), "Retrieved blogs successfully");
    }

//    @PostMapping("/accept")
//    public ResponseEntity<BaseResponse> acceptBlog(@RequestBody BlogRequestApprove request) {
//        int blogId = request.getBlogRequestId();
//        blogService.acceptBlog(blogId);
//        return ResponseUtil.createSuccessResponse(null, "Accepted blog successfully");
//    }
}
