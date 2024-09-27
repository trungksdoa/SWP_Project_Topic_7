package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IProductService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/manage/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Validated
@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "Admin API", description = "API for admin")
public class ManageProductController {
    private final IProductService productService;
    private final IImageService imageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createProduct(@RequestPart("product") String productJson, @RequestParam("image") MultipartFile file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        Product product = mapper.readValue(productJson, Product.class);

        String filename = imageService.uploadImage(file);
        product.setImageUrl(filename);
        Product createdProduct = productService.createProduct(product);
        return ResponseUtil.createResponse(createdProduct,"Access granted, created successfully",HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<BaseResponse> updateProduct(@PathVariable("id") int productId, @RequestPart("product") String productJson, @RequestParam(value = "image", required = false) MultipartFile file) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        @Valid Product product = objectMapper.readValue(productJson, Product.class);

        Product updatedProduct = productService.updateProduct(productId, product,file);
        return ResponseUtil.createSuccessResponse(updatedProduct, "Access granted,  updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseUtil.createSuccessResponse(null, "Access granted,  deleted successfully");
    }



}
