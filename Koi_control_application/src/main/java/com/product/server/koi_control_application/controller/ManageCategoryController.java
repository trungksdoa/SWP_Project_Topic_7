package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service_interface.ICategoryService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manage/api/category")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Admin API", description = "API for Category")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class ManageCategoryController {
    private final ICategoryService categoryService;


    @PostMapping()
    public ResponseEntity<BaseResponse> addCategory(@RequestBody Category category) {
        return ResponseUtil.createSuccessResponse(categoryService.addCategory(category), "Add category success");
    }

    @PutMapping("/{cateId}")
    public ResponseEntity<BaseResponse> updateCategory(@PathVariable int cateId, @RequestBody Category category) {
        return ResponseUtil.createSuccessResponse(categoryService.updateCategory(cateId, category), "Update category success");
    }

    @DeleteMapping("/{cateId}")
    public ResponseEntity<BaseResponse> deleteCategory(@PathVariable int cateId) {
        categoryService.deleteCategory(cateId);
        return ResponseUtil.createSuccessResponse("OK", "Delete category success");
    }

    @GetMapping("/{cateId}")
    public ResponseEntity<BaseResponse> getCategoryById(@PathVariable int cateId) {
        return ResponseUtil.createSuccessResponse(categoryService.getCategoryById(cateId), "Get category success");
    }
}