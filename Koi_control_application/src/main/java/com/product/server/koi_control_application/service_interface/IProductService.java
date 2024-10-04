package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.Cart;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.OutStockProduct;
import com.product.server.koi_control_application.pojo.response.CartProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProductService {
    void setDisableProduct(OutStockProduct outStockProduct);

    void increaseProductQuantity(int productId, int quantity);

    Product createProduct(Product product, MultipartFile productImage) throws IOException;
    Product updateProduct(int id, Product product, MultipartFile productImage) throws IOException;
    void deleteProduct(int productId);
    Product getProduct(int productId);
    Page<Product> getAllProducts(int page, int size);

    List<Product> getAllProducts();
    Page<Product> getProductsByCategory(int categoryId, int page, int size);

    Product getProductBySlug(String slug);

    void decreaseProductQuantity(int productId, int quantity);

    OutStockProduct checkProductOutStock(List<CartProductDTO> cart);

    boolean isProductIsDisabledFromCart(List<CartProductDTO> cart);
}
