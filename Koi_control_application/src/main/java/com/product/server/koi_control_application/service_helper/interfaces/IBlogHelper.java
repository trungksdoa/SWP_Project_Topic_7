package com.product.server.koi_control_application.service_helper.interfaces;

import com.product.server.koi_control_application.model.Blogs;

import java.util.List;

public interface IBlogHelper {
    Blogs save(Blogs blog);
    List<Blogs> findAll();
    Blogs get(int id);
    void delete(Blogs blog);
}
