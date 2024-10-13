package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.customException.BadRequestException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.OutStockProduct;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.CategoryRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.serviceHelper.interfaces.IProductHelper;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * ProductServiceImpl is a service implementation that provides methods for managing Product entities.
 * It interacts with the ProductRepository and CategoryRepository to perform CRUD operations and handles exceptions appropriately.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements IProductService {
    //region Fields
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IImageService imageService;
    private final IProductHelper productHelper;
    //endregion

    //region Product Operations

    /*
     * Creates a new product and uploads its image if provided.
     *
     * @param product      The Product object to be created.
     * @param productImage The MultipartFile representing the product image.
     * @return            The saved Product object after creation.
     *
     * This method checks if the provided image is not null and not empty.
     * If valid, it uploads the image and sets the image URL in the product.
     * Finally, it saves the product using the `productHelper` and returns the saved product.
     */
    @Override
    @Transactional
    public Product createProduct(Product product, MultipartFile productImage) throws IOException {
        if (productImage != null && !productImage.isEmpty()) {
            String filename = imageService.uploadImage(productImage);
            product.setImageUrl(filename);
        }
        return productHelper.save(product);
    }

    /*
     * Updates an existing product with the provided details.
     *
     * @param id           The ID of the product to be updated.
     * @param product      The Product object containing updated details.
     * @param productImage The MultipartFile representing the new product image (if provided).
     * @return            The updated Product object after saving.
     *
     * This method retrieves the existing product by its ID. If the product is found,
     * it updates the product's image URL if a new image is provided. It also updates
     * the category, price, name, description, and stock based on the provided product details.
     * If the image upload fails, a BadRequestException is thrown.
     */
    @Override
    @Transactional
    public Product updateProduct(int id, Product product, MultipartFile productImage) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));

        Optional.ofNullable(productImage).ifPresentOrElse(image -> {
            String filename = null;
            try {
                filename = imageService.updateImage(existingProduct.getImageUrl(), productImage);
            } catch (IOException e) {
                throw new BadRequestException(e.getMessage());
            }

            existingProduct.setImageUrl(filename);
        }, () -> existingProduct.setImageUrl(existingProduct.getImageUrl()));

        Optional.of(product.getCategoryId())
                .filter(categoryId -> categoryId != 0)
                .ifPresent(categoryId -> {
                    Category category = categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new NotFoundException("Category not found"));
                    existingProduct.setCategoryId(category.getId());
                });

        Optional.of(product.getPrice()).ifPresent(existingProduct::setPrice);
        Optional.ofNullable(product.getName()).ifPresent(existingProduct::setName);
        Optional.ofNullable(product.getDescription()).ifPresent(existingProduct::setDescription);
        Optional.ofNullable(product.getStock()).ifPresent(existingProduct::setStock);

        return productHelper.save(existingProduct);
    }

    /*
     * Deletes a product by its ID.
     *
     * @param productId The ID of the product to be deleted.
     *
     * This method retrieves the product using the productHelper and deletes it.
     */
    @Override
    @Transactional
    public void deleteProduct(int productId) {
        Product product = productHelper.get(productId);
        productHelper.delete(product);
    }

    /*
     * Retrieves a product by its ID.
     *
     * @param productId The ID of the product to retrieve.
     * @return         The Product object corresponding to the provided ID.
     *
     * This method uses the productHelper to fetch the product.
     */
    @Override
    public Product getProduct(int productId) {
        return productHelper.get(productId);
    }

    /*
     * Retrieves a paginated list of all products.
     *
     * @param page The page number to retrieve.
     * @param size The number of products per page.
     * @return     A Page containing the list of Product objects.
     *
     * This method fetches all products from the repository and calculates their average ratings.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(int page, int size) {
        Page<Product> products = productRepository.findAll(PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }

    /*
     * Retrieves a list of all products.
     *
     * @return A List of all Product objects.
     *
     * This method uses the productHelper to fetch all products.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productHelper.findAll();
    }

    /*
     * Retrieves a paginated list of products by category.
     *
     * @param categoryId The ID of the category to filter products.
     * @param page       The page number to retrieve.
     * @param size       The number of products per page.
     * @return          A Page containing the list of Product objects in the specified category.
     *
     * This method fetches products by category from the repository and calculates their average ratings.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(int categoryId, int page, int size) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }

    /*
     * Retrieves a product by its slug.
     *
     * @param slug The slug of the product to retrieve.
     * @return     The Product object corresponding to the provided slug.
     *
     * This method fetches the product from the repository and throws a NotFoundException if not found.
     */
    @Override
    @Transactional(readOnly = true)
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug).orElseThrow(() -> new NotFoundException("Product not found"));
    }

    //endregion
    //==================================================================================================================
    //region Stock Operations

    /*
     * Increases the stock quantity of a given product.
     *
     * @param product The Product object whose quantity is to be increased.
     * @param quantity The amount to increase the product's stock by.
     *
     * This method retrieves the product using the productHelper, increases its stock
     * by the specified quantity, and then saves the updated product.
     */
    @Override
    @Transactional
    public void increaseProductQuantity(Product product, int quantity) {
        Product getProduct = productHelper.get(product.getId()).increaseStock(quantity);
        productHelper.save(getProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Integer> getProductStocks(List<Integer> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        return products.stream()
                .collect(Collectors.toMap(Product::getId, Product::getStock));
    }

    /*
     * Checks if there is enough stock for a product and updates the stock if possible.
     *
     * @param productId The ID of the product to check.
     * @param requestedQuantity The quantity to be deducted from the stock.
     * @return true if the stock was successfully updated; false otherwise.
     *
     * This method retrieves the product by its ID and checks if the current stock
     * is sufficient to fulfill the requested quantity. If so, it deducts the quantity
     * from the stock and saves the updated product. If the stock is insufficient,
     * it returns false.
     */
    @Override
    @Transactional
    public boolean checkAndUpdateStock(int productId, int requestedQuantity) {
        Product product = productHelper.get(productId);

        if (product.getStock() >= requestedQuantity) {
            product.setStock(product.getStock() - requestedQuantity);
            productHelper.save(product);
            return true;
        }
        return false;
    }

    //endregion
    //==================================================================================================================
    //region Cart Operations

    /*
     * Checks if any product in the cart is disabled.
     *
     * @param cart A list of CartProductDTO objects representing the items in the cart.
     * @return     true if any product is disabled; false otherwise.
     *
     * This method uses a stream to check if any of the products in the cart are marked
     * as disabled. It returns true if at least one product is disabled.
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isProductIsDisabledFromCart(List<CartProductDTO> cart) {
        return cart.stream().anyMatch(CartProductDTO::isDisabled);
    }

    //endregion
}
