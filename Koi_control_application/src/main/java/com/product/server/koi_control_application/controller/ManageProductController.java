package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IProductService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/manage/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RolesAllowed({"ROLE_ADMIN"})
@Validated
public class ManageProductController {
    private final IProductService productService;
    private final IImageService imageService;

    @PostMapping
    public ResponseEntity<BaseResponse> createProduct(@RequestPart("product") @Valid Product product, @RequestParam("image") MultipartFile file) throws IOException {
        String filename = imageService.uploadImage(file);
        product.setImageUrl(filename);
        Product createdProduct = productService.createProduct(product);
        BaseResponse response = BaseResponse.builder()
                .data(createdProduct)
                .statusCode(HttpStatus.CREATED.value())
                .message("Create product success")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updateProduct(@PathVariable("id") int productId, @RequestPart("product") @Valid Product product, @RequestParam("image") MultipartFile file) throws IOException {

        if (file != null) {
            String filename = imageService.updateImage(product.getImageUrl(), file);
            product.setImageUrl(filename);
        }

        Product updatedProduct = productService.updateProduct(productId, product);
        BaseResponse response = BaseResponse.builder()
                .data(updatedProduct)
                .statusCode(HttpStatus.OK.value())
                .message("Product updated successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

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

}
