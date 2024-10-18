package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.model.Category;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.ICategoryService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.ManageCategoryMappings.*;

@RestController
@RequestMapping(BASE_MANAGE_CATEGORY)
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

    @PutMapping(UPDATE_CATEGORY)
    public ResponseEntity<BaseResponse> updateCategory(@PathVariable int cateId, @RequestBody Category category) {
        return ResponseUtil.createSuccessResponse(categoryService.updateCategory(cateId, category), "Update category success");
    }

    @DeleteMapping(DELETE_CATEGORY)
    public ResponseEntity<BaseResponse> deleteCategory(@PathVariable int cateId) {
        categoryService.deleteCategory(cateId);
        return ResponseUtil.createSuccessResponse("OK", "Delete category success");
    }

    @GetMapping(GET_CATEGORY_BY_ID)
    public ResponseEntity<BaseResponse> getCategoryById(@PathVariable int cateId) {
        return ResponseUtil.createSuccessResponse(categoryService.getCategoryById(cateId), "Get category success");
    }

    
    @PostMapping("/{categoryId}/subcategories")
    @Operation(summary = "Add subcategory", description = "Adds a new subcategory to an existing category")
    public ResponseEntity<BaseResponse> addSubcategory(@PathVariable int categoryId, @RequestBody @Valid Category subcategory) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }
}