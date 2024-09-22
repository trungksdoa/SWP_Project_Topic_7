package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    Product createProduct(Product product);
    Product updateProduct(int id, Product product, MultipartFile file) throws IOException; ;
    void deleteProduct(int productId);
    Product getProduct(int productId);
    Page<Product> getAllProducts(int page, int size);

    List<Product> getAllProducts();
    Page<Product> getProductsByCategory(int categoryId, int page, int size);
}
