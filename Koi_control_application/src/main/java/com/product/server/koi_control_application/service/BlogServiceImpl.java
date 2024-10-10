package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.BlogsRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IBlogHelper;
import com.product.server.koi_control_application.serviceInterface.IBlogService;
import com.product.server.koi_control_application.serviceInterface.IImageService;
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
    private final IBlogHelper blogHelper;
    @Override
    @Transactional
    public Blogs createBlog(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        if (repo.existsByTitle(blog.getTitle())) {
            throw new BadRequestException("A blog with this title already exists");
        }
        setImageUrls(blog, headerImage, bodyImage);
        return blogHelper.save(blog);
    }

    @Override
    @Transactional
    public Blogs updateBlog(int id, Blogs updatedBlog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException {
        Blogs existingBlog = blogHelper.get(id);

        if (!existingBlog.getTitle().equals(updatedBlog.getTitle()) && repo.existsByTitle(updatedBlog.getTitle())) {
            throw new BadRequestException("A blog with this title already exists");
        }

        updateBlogFields(existingBlog, updatedBlog);
        updateImageUrls(existingBlog, headerImage, bodyImage);

        return blogHelper.save(existingBlog);
    }

    @Override
    @Transactional
    public void deleteBlog(int id) {
        Blogs blog = blogHelper.get(id);
        blogHelper.delete(blog);
    }

    @Override
    public List<Blogs> getAllBlogs() {
        return blogHelper.findAll();
    }

    @Override
    public Blogs getBlogById(int id) {
        return blogHelper.get(id);
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
    public void acceptBlog(int id) {
        Blogs blog = blogHelper.get(id);
        blog.setApproved(true);
        blogHelper.save(blog);
    }

    @Override
    public List<Blogs> searchBlogs(String title, String headerTop, String headerMiddle) {
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