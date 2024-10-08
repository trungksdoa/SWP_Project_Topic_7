package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Category;

import java.util.List;

/**
 * This interface defines the contract for category-related operations.
 * It provides methods for adding, deleting, updating, and retrieving categories.
 */
public interface ICategoryService {

    /**
     * Adds a new category.
     *
     * @param category The Category object to be added.
     * @return        The created Category object.
     */
    Category addCategory(Category category);

    /**
     * Deletes a category by its ID.
     *
     * @param id The ID of the category to be deleted.
     */
    void deleteCategory(int id);

    /**
     * Updates an existing category.
     *
     * @param id       The ID of the category to update.
     * @param category The Category object containing updated details.
     * @return        The updated Category object.
     */
    Category updateCategory(int id, Category category);

    /**
     * Retrieves all categories.
     *
     * @return A List of all Category objects.
     */
    List<Category> getAllCategories();

    /**
     * Retrieves a category by its ID.
     *
     * @param id The ID of the category to retrieve.
     * @return   The Category object corresponding to the provided ID.
     */
    Category getCategoryById(int id);
}