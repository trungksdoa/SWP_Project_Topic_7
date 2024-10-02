package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Blogs;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IBlogService {
    Blogs createBlog(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException;

    Blogs updateBlog(int id, Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException;

    void deleteBlog(int id);

    List<Blogs> getAllBlogs();

    Blogs getBlogById(int id);

    List<Blogs> getBlogsByAuthor(int authorId);

    Blogs getBlogBySlug(String slug);

    List<Blogs> searchBlogs(String... params);
}
