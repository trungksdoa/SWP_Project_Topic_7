package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Blogs;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * This interface defines the contract for blog-related operations.
 * It provides methods for creating, updating, deleting, and retrieving blogs,
 * as well as managing blog acceptance and searching.
 */
public interface IBlogService {

    /**
     * Creates a new blog post.
     *
     * @param blog        The Blogs object containing the blog details.
     * @param headerImage The MultipartFile representing the header image.
     * @param bodyImage   The MultipartFile representing the body image.
     * @return The created Blogs object.
     * @throws IOException If an error occurs while processing the images.
     */
    Blogs createBlog(Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException;

    /**
     * Updates an existing blog post.
     *
     * @param id          The ID of the blog to update.
     * @param blog        The Blogs object containing updated blog details.
     * @param headerImage The MultipartFile representing the new header image (if provided).
     * @param bodyImage   The MultipartFile representing the new body image (if provided).
     * @return The updated Blogs object.
     * @throws IOException If an error occurs while processing the images.
     */
    Blogs updateBlog(int id, Blogs blog, MultipartFile headerImage, MultipartFile bodyImage) throws IOException;

    /**
     * Deletes a blog post by its ID.
     *
     * @param id The ID of the blog to delete.
     */
    void deleteBlog(int id);

    /**
     * Retrieves all blog posts.
     *
     * @return A List of all Blogs objects.
     */
    List<Blogs> getAllBlogs();

    /**
     * Retrieves a blog post by its ID.
     *
     * @param id The ID of the blog to retrieve.
     * @return The Blogs object corresponding to the provided ID.
     */
    Blogs getBlogById(int id);

    /**
     * Retrieves all blog posts by a specific author.
     *
     * @param authorId The ID of the author whose blogs to retrieve.
     * @return A List of Blogs objects authored by the specified author.
     */
    List<Blogs> getBlogsByAuthor(int authorId);

    /**
     * Retrieves a blog post by its slug.
     *
     * @param slug The slug of the blog to retrieve.
     * @return The Blogs object corresponding to the provided slug.
     */
    Blogs getBlogBySlug(String slug);

    /**
     * Accepts a blog post for publication.
     *
     * @param id The ID of the blog to accept.
     */
    void acceptBlog(int id);

    /**
     * Searches for blog posts based on the provided parameters.
     *
     * @param title The title to search for.
     *              If null, all titles will be considered.
     * @param headerTop    The header top to search for.
     */
    List<Blogs> searchBlogs(String title, String headerTop, String headerMiddle);
}