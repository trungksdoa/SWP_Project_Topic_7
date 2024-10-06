package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.OutStockProduct;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import com.product.server.koi_control_application.repository.CategoryRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IImageService imageService;

    @Override
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug).orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Override
    public void decreaseProductQuantity(int productId, int quantity) {
        Product product = getProduct(productId);
        save(product.decreaseStock(quantity));
    }

    @Override
    public OutStockProduct checkProductOutStock(List<CartProductDTO> cart) {
        OutStockProduct outStockProduct = new OutStockProduct();
        outStockProduct.setOutStockProducts(new ArrayList<>());
        for (CartProductDTO cartItem : cart) {
            if (cartItem.getStock() < cartItem.getQuantity()) {
                Product product = getProduct(cartItem.getProductId());
                outStockProduct.getOutStockProducts().add(product);
            }
        }
        return outStockProduct;
    }

    @Override
    public boolean isProductIsDisabledFromCart(List<CartProductDTO> cart) {
       return cart.stream().anyMatch(CartProductDTO::isDisabled);
    }


    @Override
    public void setDisableProduct(OutStockProduct outStockProduct) {
        List<Product> outStockProducts = outStockProduct.getOutStockProducts();
        for (Product product : outStockProducts) {
            Product product1 = getProduct(product.getId());
            product1.setDisabled(true);
            save(product1);
        }
    }
    @Override
    @Retryable(value = {OptimisticLockingFailureException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    @Transactional
    public boolean checkAndUpdateStock(int productId, int requestedQuantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        if (product.getStock() >= requestedQuantity) {
            product.setStock(product.getStock() - requestedQuantity);
            productRepository.save(product);
            return true;
        }
        return false;
    }

    @Override
    public void increaseProductQuantity(Product product, int quantity) {
        save(product.increaseStock(quantity));
    }

    @Override
    @Transactional
    public Product createProduct(Product product, MultipartFile productImage) throws IOException {

        if (productImage != null && !productImage.isEmpty()) {
            String filename = imageService.uploadImage(productImage);
            product.setImageUrl(filename);
        }
        return save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(int id, Product product, MultipartFile productImage) throws IOException {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));

        if (productImage != null) {
            String filename = imageService.updateImage(existingProduct.getImageUrl(), productImage);
            existingProduct.setImageUrl(filename);
        } else {
            existingProduct.setImageUrl(existingProduct.getImageUrl());
        }

        if (product.getCategoryId() != 0) {
            Category gory = categoryRepository.findById(product.getCategoryId()).orElseThrow(() -> new NotFoundException("Category not found"));
            existingProduct.setCategoryId(gory.getId());
        }

        if (product.getName() != null) {
            existingProduct.setName(product.getName());
        }
        if (product.getPrice() != 0) {
            existingProduct.setPrice(product.getPrice());
        }
        if (product.getDescription() != null) {
            existingProduct.setDescription(product.getDescription());
        }
        if (product.getStock() != null) {
            existingProduct.setStock(product.getStock());
        }

        return save(existingProduct);
    }

    @Override
    public void deleteProduct(int productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public Product getProduct(int productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new NotFoundException("Product not found"));
        product.calculateAverageRating();
        return product;
    }

    @Override
    public Page<Product> getAllProducts(int page, int size) {
        Page<Product> products = productRepository.findAll(PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> getProductsByCategory(int categoryId, int page, int size) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }


    private Product save(Product product) {
        try {
            log.info("Saving product: {}", product);
            return productRepository.save(product);
        } catch (Exception e) {
            log.error("Error saving product: {}", product);
            throw new RuntimeException("Error saving product");
        }
    }


}