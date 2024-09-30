package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.BlogsRepository;
import com.product.server.koi_control_application.service_interface.IBlogService;
import com.product.server.koi_control_application.service_interface.IImageService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements IBlogService {
    private final BlogsRepository repo;
    private final IImageService imageService;
    @Override
    public Blogs createBlog(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        return getBlogs(headerImage, bodyImage, blog);
    }

    @Override
    public Blogs updateBlog(int id, Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        Blogs existingBlog = repo.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));

        Optional.ofNullable(blog.getTitle()).ifPresent(existingBlog::setTitle);
        Optional.ofNullable(blog.getHeaderTop()).ifPresent(existingBlog::setHeaderTop);
        Optional.ofNullable(blog.getContentTop()).ifPresent(existingBlog::setContentTop);
        Optional.ofNullable(blog.getHeaderMiddle()).ifPresent(existingBlog::setHeaderMiddle);
        Optional.ofNullable(blog.getContentMiddle()).ifPresent(existingBlog::setContentMiddle);


        return getBlogs(headerImage, bodyImage, existingBlog);
    }

    @NonNull
    private Blogs getBlogs(MultipartFile headerImage, MultipartFile bodyImage, Blogs existingBlog) throws IOException {
        if (headerImage != null && !headerImage.isEmpty()) {
            String headerImageUrl = imageService.uploadImage(headerImage);
            existingBlog.setHeaderImageUrl(headerImageUrl);
        }
        if (bodyImage != null && !bodyImage.isEmpty()) {
            String bodyImageUrl = imageService.uploadImage(bodyImage);
            existingBlog.setBodyImageUrl(bodyImageUrl);
        }

        return repo.save(existingBlog);
    }

    @Override
    public void deleteBlog(int id) {
        repo.deleteById(id);
    }

    @Override
    public List<Blogs> getAllBlogs() {
        return repo.findAll();
    }

    @Override
    public Blogs getBlogById(int id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("No blog found with id: " + id));
    }

    @Override
    public List<Blogs> getBlogsByAuthor(int authorId) {
        return repo.findByAuthor(Users.builder().id(authorId).build());
    }
}
