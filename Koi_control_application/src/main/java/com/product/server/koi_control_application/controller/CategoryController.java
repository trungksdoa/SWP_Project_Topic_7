package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.ICategoryService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.CategoryMappings.BASE_CATEGORY;
import static com.product.server.koi_control_application.mappingInterface.CategoryMappings.GET_ALL_CATEGORIES;

@RestController
@RequestMapping(BASE_CATEGORY)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Category", description = "API for Category")

public class CategoryController {
    private final ICategoryService categoryService;

    @GetMapping(GET_ALL_CATEGORIES)
    public ResponseEntity<BaseResponse> getAllCategory() {
        return ResponseUtil.createSuccessResponse(categoryService.getAllCategories(), "Get all category success");
    }

    
}