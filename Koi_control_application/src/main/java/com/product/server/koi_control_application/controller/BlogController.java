package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.request.BlogCreateDTO;
import com.product.server.koi_control_application.service_interface.IBlogService;
import com.product.server.koi_control_application.service_interface.IUserService;
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
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SHOP')")
@Tag(name = "Blog", description = "API for blog")
public class BlogController {
    private final IBlogService blogService;
    private final JwtTokenUtil jwtUtil;
    private final IUserService userService;
    @GetMapping
    public ResponseEntity<List<Blogs>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getBlogById(@PathVariable int id) {
        return ResponseUtil.createSuccessResponse(blogService.getBlogById(id), "Success");
    }




    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createBlog(
            @RequestPart("blog") @Schema(type = "string", format = "json", implementation = BlogCreateDTO.class) String blogJson,
            @RequestPart(value = "headerImage", required = false) MultipartFile headerImage,
            @RequestPart(value = "bodyImage", required = false) MultipartFile bodyImage,
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
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<BaseResponse> createBlog(
//            @RequestPart("blog") String blog,
//            @RequestPart(value = "headerImage", required = false) MultipartFile headerImage,
//            @RequestPart(value = "bodyImage", required = false) MultipartFile bodyImage) throws IOException {
//
//        ObjectMapper mapper = new ObjectMapper();
//        @Valid Blogs bs = mapper.readValue(blog, Blogs.class);
//
//        return ResponseUtil.createResponse(blogService.createBlog(bs, headerImage, bodyImage), "Created blog successfully", HttpStatus.CREATED);
//    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> updateBlog(
            @PathVariable int id,
            @RequestPart("blog") @Schema(type = "string", format = "json", implementation = BlogCreateDTO.class) String blogJson,
            @RequestPart(value = "headerImage", required = false) MultipartFile headerImage,
            @RequestPart(value = "bodyImage", required = false) MultipartFile bodyImage) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        @Valid Blogs blog = mapper.readValue(blogJson, Blogs.class);
        return ResponseUtil.createResponse(blogService.updateBlog(id, blog, headerImage, bodyImage), "Created blog successfully", HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteBlog(@PathVariable int id) {
        blogService.deleteBlog(id);
        return ResponseUtil.createSuccessResponse(null,"Deleted blog successfully");
    }
}