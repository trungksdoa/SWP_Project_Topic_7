package com.product.server.koi_control_application.mappingInterface;

public interface BlogMappings {
    String BASE_BLOG = "/api/blogs";
    String GET_BLOG_BY_ID = "/{blogId}";
    String UPDATE_BLOG = "/{updateBlogId}";
    String DELETE_BLOG = "/{deleteBlogId}";
    String GET_BLOG_BY_SLUG = "/title/{slug}";
    String GET_BLOG_BY_AUTHOR = "/author/{authorId}";
    String SEARCH_BLOG = "/search/";
}