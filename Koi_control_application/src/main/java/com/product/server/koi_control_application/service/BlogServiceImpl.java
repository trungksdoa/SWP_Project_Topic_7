package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.BadRequestException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.BlogsRepository;
import com.product.server.koi_control_application.service_interface.IBlogService;
import com.product.server.koi_control_application.service_interface.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements IBlogService {
    private final BlogsRepository repo;
    private final IImageService imageService;

    @Override
    @Transactional
    public Blogs createBlog(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        if (repo.existsByTitle(blog.getTitle())) {
            throw new BadRequestException("A blog with this title already exists");
        }
        setImageUrls(blog, headerImage, bodyImage);
        return repo.save(blog);
    }

    @Override
    @Transactional
    public Blogs updateBlog(int id, Blogs updatedBlog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        Blogs existingBlog = repo.findById(id).orElseThrow(() -> new NotFoundException("Blog not found with id: " + id));

        if (!existingBlog.getTitle().equals(updatedBlog.getTitle()) && repo.existsByTitle(updatedBlog.getTitle())) {
            throw new BadRequestException("A blog with this title already exists");
        }

        updateBlogFields(existingBlog, updatedBlog);
        updateImageUrls(existingBlog, headerImage, bodyImage);

        return repo.save(existingBlog);
    }

    @Override
    public void deleteBlog(int id) {
        if(!repo.existsById(id)) {
            throw new NotFoundException("No blog found with id: " + id);
        }
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

    @Override
    public Blogs getBlogBySlug(String slug) {
        return repo.findBySlug(slug).orElseThrow(() -> new NotFoundException("No blog found with slug: " + slug));
    }

    @Override
    public List<Blogs> searchBlogs(String... params) {
        String title = params.length > 0 ? params[0] : null;
        String headerTop = params.length > 1 ? params[1] : null;
        String headerMiddle = params.length > 2 ? params[2] : null;
        return repo.searchByTitleAndHeader(title, headerTop, headerMiddle);
    }

    private void setImageUrls(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        if (headerImage != null && !headerImage.isEmpty()) {
            blog.setHeaderImageUrl(imageService.uploadImage(headerImage));
        }
        if (bodyImage != null && !bodyImage.isEmpty()) {
            blog.setBodyImageUrl(imageService.uploadImage(bodyImage));
        }
    }

    private void updateBlogFields(Blogs existingBlog, Blogs updatedBlog) {
        if (StringUtils.hasText(updatedBlog.getTitle())) existingBlog.setTitle(updatedBlog.getTitle());
        if (StringUtils.hasText(updatedBlog.getHeaderTop())) existingBlog.setHeaderTop(updatedBlog.getHeaderTop());
        if (StringUtils.hasText(updatedBlog.getContentTop())) existingBlog.setContentTop(updatedBlog.getContentTop());
        if (StringUtils.hasText(updatedBlog.getHeaderMiddle())) existingBlog.setHeaderMiddle(updatedBlog.getHeaderMiddle());
        if (StringUtils.hasText(updatedBlog.getContentMiddle())) existingBlog.setContentMiddle(updatedBlog.getContentMiddle());
    }

    private void updateImageUrls(Blogs existingBlog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        if (headerImage != null && !headerImage.isEmpty()) {
            existingBlog.setHeaderImageUrl(updateOrUploadImage(existingBlog.getHeaderImageUrl(), headerImage));
        }
        if (bodyImage != null && !bodyImage.isEmpty()) {
            existingBlog.setBodyImageUrl(updateOrUploadImage(existingBlog.getBodyImageUrl(), bodyImage));
        }
    }

    private String updateOrUploadImage(String existingUrl, MultipartFile newImage) throws IOException {
        if (existingUrl == null) {
            return imageService.uploadImage(newImage);
        } else {
            return imageService.updateImage(imageService.getFileName(existingUrl), newImage);
        }
    }
}