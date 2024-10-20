package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.ProductMappings.*;

@RestController
@RequestMapping(BASE_PRODUCT)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Product", description = "API for Product")
public class ProductController {
    private final IProductService productService;


    @GetMapping(GET_PRODUCT_BY_ID)
    public ResponseEntity<BaseResponse> getProductById(@PathVariable int id) {
        Product product = productService.getProduct(id);
        return ResponseUtil.createSuccessResponse(product, "Product retrieved successfully");
    }

    @GetMapping
    public ResponseEntity<BaseResponse> getProductList(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getAllProducts(page, size);
        return ResponseUtil.createSuccessResponse(products, "Products retrieved successfully");
    }

    @GetMapping(GET_BY_SLUG)
    public ResponseEntity<BaseResponse> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        return ResponseUtil.createSuccessResponse(product, "Product retrieved successfully");
    }

    @GetMapping(GET_BY_CATEGORY)
    public ResponseEntity<BaseResponse> getProductsByCategory(@PathVariable int categoryId,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getProductsByCategory(categoryId, page, size);
        return ResponseUtil.createSuccessResponse(products, "Products retrieved successfully");
    }

    @GetMapping(GET_ALL_PRODUCT)
    public ResponseEntity<BaseResponse> getProductList() {
        return ResponseUtil.createSuccessResponse(productService.getAllProducts(), "Products retrieved successfully");
    }

    //Create full search api


}