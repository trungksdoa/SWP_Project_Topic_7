package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN","ROLE_MEMBER","ROLE_SHOP"})
public class ProductController {
    private final IProductService productService;
    private final IImageService imageService;



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