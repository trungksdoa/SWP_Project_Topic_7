package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Category;

import java.util.List;

public interface ICategoryService {
    Category addCategory(Category category);
    void deleteCategory(int id);
    Category updateCategory(int id, Category category);
    List<Category> getAllCategories();

    Category getCategoryById(int id);
}
