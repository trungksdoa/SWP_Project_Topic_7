package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.dto.BaseResponse;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.service.IImageService;
import com.product.server.koi_control_application.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final IProductService productService;
    private final IImageService imageService;

    @PostMapping
    public ResponseEntity<BaseResponse> createProduct(@RequestBody Product product)  {
        product.setImageUrl("");
        Product createdProduct = productService.createProduct(product);
        BaseResponse response = BaseResponse.builder()
                .data(createdProduct)
                .statusCode(HttpStatus.CREATED.value())
                .message("Product created successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("{productId}/image/upload/")
    public ResponseEntity<BaseResponse> uploadProductImage(@PathVariable int productId, @RequestParam("image") MultipartFile file) throws IOException {
        String filename = imageService.uploadImage(file);
        Product savedProduct = productService.getProduct(productId);
        savedProduct.setImageUrl(filename);
        productService.createProduct(savedProduct);
        BaseResponse response = BaseResponse.builder()
                .data(savedProduct)
                .statusCode(HttpStatus.CREATED.value())
                .message("Upload image success to "+ savedProduct.getName())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse> getProductById(@PathVariable int id) {
        Product product = productService.getProduct(id);
        BaseResponse response = BaseResponse.builder()
                .data(product)
                .statusCode(HttpStatus.OK.value())
                .message("Product retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getProductList(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getAllProducts(page, size);
        BaseResponse response = BaseResponse.builder()
                .data(products)
                .statusCode(HttpStatus.OK.value())
                .message("Products retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<BaseResponse> updateProduct(@PathVariable int id, @RequestBody Product product) {
//        Product updatedProduct = productService.updateProduct(id, product);
//        BaseResponse response = BaseResponse.builder()
//                .data(updatedProduct)
//                .statusCode(HttpStatus.OK.value())
//                .message("Product updated successfully")
//                .build();
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        BaseResponse response = BaseResponse.builder()
                .data(null)
                .statusCode(HttpStatus.OK.value())
                .message("Product deleted successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<BaseResponse> getProductsByCategory(@PathVariable int categoryId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getProductsByCategory(categoryId, page, size);
        BaseResponse response = BaseResponse.builder()
                .data(products)
                .statusCode(HttpStatus.OK.value())
                .message("Products retrieved successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}