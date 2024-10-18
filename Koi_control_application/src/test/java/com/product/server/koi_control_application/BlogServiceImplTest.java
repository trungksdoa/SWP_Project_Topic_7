package com.product.server.koi_control_application;

import com.product.server.koi_control_application.model.Blogs;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.BlogsRepository;
import com.product.server.koi_control_application.service.BlogServiceImpl;
import com.product.server.koi_control_application.serviceHelper.BlogHelper;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import io.micrometer.core.annotation.Timed;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;


@Transactional
class BlogServiceImplTest {

    @Mock
    private BlogHelper blogHelper;

    @Mock
    private IImageService imageService;

    @InjectMocks
    private BlogServiceImpl blogService;
    @Mock
    private BlogsRepository blogsRepository;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        blogService = new BlogServiceImpl(blogsRepository, imageService, blogHelper);
    }
    @Test
    @Timed(value = "createBlog.createBlog")
    void createBlog() throws IOException {
        Blogs blog = new Blogs();
        blog.setTitle("Test Blog");
        blog.setHeaderTop("Header Top");
        blog.setHeaderMiddle("Header Bottom");
        blog.setContentTop("Body");
        blog.setContentMiddle("Footer");
        blog.setAuthor(Users.builder().id(34).build());
        MultipartFile headerImage = new MockMultipartFile("header.jpg", new byte[0]);
        MultipartFile bodyImage = new MockMultipartFile("body.jpg", new byte[0]);


//        when(imageService.uploadImage(any(MultipartFile.class))).thenReturn("image_url");
        when(blogHelper.save(any(Blogs.class))).thenReturn(blog);

        Blogs result = blogService.createBlog(blog, headerImage, bodyImage);

        assertNotNull(result);
//        verify(imageService, times(2)).uploadImage(any(MultipartFile.class));
        verify(blogHelper).save(any(Blogs.class));
    }

    @Test
    @Timed(value = "updateBlog.updateBlog")
    void updateBlog() throws IOException {
        int id = 1;
        Blogs blog = new Blogs();
        blog.setTitle("Test Update Blog");
        blog.setHeaderTop("Header Top");
        blog.setHeaderMiddle("Header Bottom");
        blog.setContentTop("Body");
        blog.setContentMiddle("Footer");
        MultipartFile headerImage = new MockMultipartFile("header.jpg", new byte[0]);
        MultipartFile bodyImage = new MockMultipartFile("body.jpg", new byte[0]);

        when(blogHelper.get(id)).thenReturn(blog);
        when(blogHelper.save(any(Blogs.class))).thenReturn(blog);

        Blogs result = blogService.updateBlog(id, blog, headerImage, bodyImage);

        assertNotNull(result);
        verify(blogHelper).get(id);
        verify(blogHelper).save(any(Blogs.class));
    }

    @Test
    @Timed(value = "deleteBlog.deleteBlog")
    void deleteBlog() {
        int id = 1;
        Blogs blog = new Blogs();

        when(blogHelper.get(id)).thenReturn(blog);

        blogService.deleteBlog(id);

        verify(blogHelper).get(id);
        verify(blogHelper).delete(blog);
    }

    @Test
    @Timed(value = "getAllBlogs.getAllBlogs")
    void getAllBlogs() {
        List<Blogs> blogsList = Arrays.asList(new Blogs(), new Blogs());

        when(blogHelper.findAll()).thenReturn(blogsList);

        List<Blogs> result = blogService.getAllBlogs();

        assertEquals(2, result.size());
        verify(blogHelper).findAll();
    }

    @Test
    @Timed(value = "getBlogById.getBlogById")
    void getBlogById() {
        int id = 1;
        Blogs blog = new Blogs();

        when(blogHelper.get(id)).thenReturn(blog);

        Blogs result = blogService.getBlogById(id);

        assertNotNull(result);
        verify(blogHelper).get(id);
    }
}