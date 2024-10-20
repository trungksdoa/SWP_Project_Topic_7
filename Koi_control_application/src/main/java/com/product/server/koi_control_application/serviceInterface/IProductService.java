package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.OutStockProduct;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * This interface defines the contract for product-related operations.
 * It provides methods for creating, updating, deleting, and retrieving products,
 * as well as managing product stock levels and handling shopping cart operations.
 */
public interface IProductService {

    /**
     * Creates a new product and uploads its image if provided.
     *
     * @param product      The Product object to be created.
     * @param productImage The MultipartFile representing the product image.
     * @return            The created Product object.
     * @throws IOException If an error occurs during image upload.
     */
    Product createProduct(Product product, MultipartFile productImage) throws IOException;

    /**
     * Updates an existing product with the provided details.
     *
     * @param id           The ID of the product to be updated.
     * @param product      The Product object containing updated details.
     * @param productImage The MultipartFile representing the new product image (if provided).
     * @return            The updated Product object.
     */
    Product updateProduct(int id, Product product, MultipartFile productImage) ;

    /**
     * Deletes a product by its ID.
     *
     * @param productId The ID of the product to be deleted.
     */
    void deleteProduct(int productId);

    /**
     * Retrieves a product by its ID.
     *
     * @param productId The ID of the product to retrieve.
     * @return         The Product object corresponding to the provided ID.
     */
    Product getProduct(int productId);

    /**
     * Retrieves a paginated list of all products.
     *
     * @param page The page number to retrieve.
     * @param size The number of products per page.
     * @return     A Page containing the list of Product objects.
     */
    Page<Product> getAllProducts(int page, int size);

    /**
     * Retrieves a list of all products.
     *
     * @return A List of all Product objects.
     */
    List<Product> getAllProducts();

    /**
     * Retrieves a paginated list of products by category.
     *
     * @param categoryId The ID of the category to filter products.
     * @param page       The page number to retrieve.
     * @param size       The number of products per page.
     * @return          A Page containing the list of Product objects in the specified category.
     */
    Page<Product> getProductsByCategory(int categoryId, int page, int size);

    /**
     * Retrieves a product by its slug.
     *
     * @param slug The slug of the product to retrieve.
     * @return     The Product object corresponding to the provided slug.
     */
    Product getProductBySlug(String slug);


    /**
     * Checks if any product in the cart is disabled.
     *
     * @param cart A list of CartProductDTO objects representing the items in the cart.
     * @return     true if any product is disabled; false otherwise.
     */
    boolean isProductIsDisabledFromCart(List<CartProductDTO> cart);

    /**
     * Checks if there is enough stock for a product and updates the stock if possible.
     *
     * @param productId        The ID of the product to check.
     * @param requestedQuantity The quantity to be deducted from the stock.
     * @return                true if the stock was successfully updated; false otherwise.
     */
    @Transactional
    boolean checkAndUpdateStock(int productId, int requestedQuantity);

    /**
     * Increases the stock quantity of a given product.
     *
     * @param product The Product object whose quantity is to be increased.
     * @param quantity The amount to increase the product's stock by.
     */
    void increaseProductQuantity(Product product, int quantity);

     Map<Integer, Integer> getProductStocks(List<Integer> productIds) ;

    /**
     *
     * @param name
     * @return
     */

     List<Product> searchProductByName(String name);
}