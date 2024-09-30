package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.repository.CategoryRepository;
import com.product.server.koi_control_application.service_interface.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(int id) {
        if (!categoryRepository.existsById(id)) throw new NotFoundException("Category not found");
        categoryRepository.deleteById(id);
    }

    @Override
    public Category updateCategory(int id, Category category) {
        Category category1 = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
        Optional.ofNullable(category.getName()).ifPresent(category1::setName);
        Optional.ofNullable(category.getDescription()).ifPresent(category1::setDescription);
        return addCategory(category1);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Category not found"));
    }
}
