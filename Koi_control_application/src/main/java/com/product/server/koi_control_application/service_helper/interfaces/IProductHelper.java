package com.product.server.koi_control_application.service_helper.interfaces;

import com.product.server.koi_control_application.model.Product;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * This interface defines the contract for product helper operations.
 * It provides methods for saving, retrieving, and deleting products,
 * as well as retrieving all products.
 */
public interface IProductHelper {

    /**
     * Saves a product to the database.
     *
     * @param product The Product object to be saved.
     * @return       The saved Product object.
     *
     * This method persists the provided product to the database and returns the saved instance.
     */
    @Transactional
    Product save(Product product);

    /**
     * Retrieves a product by its ID.
     *
     * @param productId The ID of the product to retrieve.
     * @return         The Product object corresponding to the provided ID.
     *
     * This method fetches the product from the database using the provided ID.
     */
    @Transactional(readOnly = true)
    Product get(int productId);

    /**
     * Retrieves all products from the database.
     *
     * @return A List of all Product objects.
     *
     * This method fetches all products from the database and returns them as a list.
     */
    @Transactional(readOnly = true)
    List<Product> findAll();

    /**
     * Deletes a product from the database.
     *
     * @param product The Product object to be deleted.
     * @return       true if the product was successfully deleted; false otherwise.
     *
     * This method removes the specified product from the database.
     */
    @Transactional
    boolean delete(Product product);
}