package com.product.server.koi_control_application.serviceHelper;

import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IProductHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ProductHelper is a service implementation that provides helper methods
 * for managing Product entities. It interacts with the ProductRepository
 * to perform CRUD operations and handles exceptions appropriately.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductHelper implements IProductHelper {
    private final ProductRepository productRepository;

    /**
     * Saves a product to the database.
     *
     * @param product The Product object to be saved.
     * @return       The saved Product object.
     * @throws BadRequestException If an error occurs while saving the product.
     *
     * This method persists the provided product to the database and returns the saved instance.
     */
    @Transactional
    @Override
    public Product save(Product product) {
        try {
            log.info("Saving product: {}", product);
            return productRepository.save(product);
        } catch (Exception e) {
            log.error("Error saving product: {}", product);
            throw new BadRequestException("Error saving product");
        }
    }

    /**
     * Retrieves a product by its ID.
     *
     * @param productId The ID of the product to retrieve.
     * @return         The Product object corresponding to the provided ID.
     * @throws BadRequestException If the product is not found.
     *
     * This method fetches the product from the database using the provided ID.
     */
    @Transactional(readOnly = true)
    @Override
    public Product get(int productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException("Product not found"));
    }

    /**
     * Retrieves all products from the database.
     *
     * @return A List of all Product objects.
     *
     * This method fetches all products from the database and returns them as a list.
     */
    @Transactional(readOnly = true)
    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    /**
     * Deletes a product from the database.
     *
     * @param product The Product object to be deleted.
     * @return       true if the product was successfully deleted; false otherwise.
     * @throws BadRequestException If an error occurs while deleting the product.
     *
     * This method removes the specified product from the database.
     */
    @Transactional
    @Override
    public boolean delete(Product product) {
        try {
            productRepository.delete(product);
            return true;
        } catch (Exception e) {
            log.error("Error deleting product: {}", product);
            throw new BadRequestException("Error deleting product");
        }
    }
}