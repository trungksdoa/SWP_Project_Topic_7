package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.request.ProductDTO;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.media.Schema;
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

import static com.product.server.koi_control_application.mappingInterface.ManageProductMappings.*;


@RestController
@RequestMapping(BASE_MANAGE_PRODUCT)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Validated
@PreAuthorize("hasRole('ROLE_ADMIN')")
@Tag(name = "Admin API", description = "API for admin")
public class ManageProductController {
    private final IProductService productService;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createProduct(
            @Schema(type = "string", format = "json", implementation = ProductDTO.class)
            @RequestPart("product") String productJson,
            @RequestParam("image") MultipartFile file) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        @Valid Product product = mapper.readValue(productJson, Product.class);

        Product createdProduct = productService.createProduct(product, file);
        return ResponseUtil.createResponse(createdProduct, "Access granted, created successfully", HttpStatus.CREATED);
    }

    @PutMapping(value = UPDATE_PRODUCT, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public ResponseEntity<BaseResponse> updateProduct(
            @PathVariable("id") int productId,
            @Schema(type = "string", format = "json", implementation = ProductDTO.class)
            @RequestPart("product") String productJson,
            @RequestParam(value = "image",
                    required = false) MultipartFile file) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        @Valid Product product = objectMapper.readValue(productJson, Product.class);

        Product updatedProduct = productService.updateProduct(productId, product, file);
        return ResponseUtil.createSuccessResponse(updatedProduct, "Access granted,  updated successfully");
    }

    @DeleteMapping(DELETE_PRODUCT)
    public ResponseEntity<BaseResponse> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseUtil.createSuccessResponse(null, "Access granted,  deleted successfully");
    }


    @PostMapping("/bulk-create")
    @Operation(summary = "Bulk create products", description = "Creates multiple products in a single request")
    public ResponseEntity<BaseResponse> bulkCreateProducts(@RequestBody @Valid List<ProductDTO> products) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{productId}/variants")
    @Operation(summary = "Add product variant", description = "Adds a new variant to an existing product")
    public ResponseEntity<BaseResponse> addProductVariant(@PathVariable int productId, @RequestBody @Valid ProductVariantDTO variantDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PutMapping("/variants/{variantId}")
    @Operation(summary = "Update product variant", description = "Updates an existing product variant")
    public ResponseEntity<BaseResponse> updateProductVariant(@PathVariable int variantId, @RequestBody @Valid ProductVariantDTO variantDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @DeleteMapping("/variants/{variantId}")
    @Operation(summary = "Delete product variant", description = "Deletes a product variant")
    public ResponseEntity<BaseResponse> deleteProductVariant(@PathVariable int variantId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{productId}/reviews")
    @Operation(summary = "Add product review", description = "Adds a new review to a product")
    public ResponseEntity<BaseResponse> addProductReview(@PathVariable int productId, @RequestBody @Valid ProductReviewDTO reviewDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

}
