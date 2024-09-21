package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.service_interface.IProductService;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.repository.CategoryRepository;
import com.product.server.koi_control_application.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    @Override
    @Transactional
    public Product createProduct(Product product) {
        product = productRepository.save(product);
        return product;
    }

    @Override
    @Transactional
    public Product updateProduct(int id, Product product) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
        existingProduct.setName(product.getName());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategoryId(product.getCategoryId());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setStock(product.getStock());
        return productRepository.save(existingProduct);
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
    public Page<Product> getAllProducts(int page, int size){
        Page<Product> products = productRepository.findAll(PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }

    @Override
    public Page<Product> getProductsByCategory(int categoryId, int page, int size) {
        Page<Product> products = productRepository.findByCategoryId(categoryId,PageRequest.of(page, size));
        products.getContent().forEach(Product::calculateAverageRating);
        return products;
    }
}