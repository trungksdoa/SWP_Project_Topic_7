package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.service_interface.ICategoryService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    private final ICategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<BaseResponse> getAllCategory() {
        return ResponseUtil.createSuccessResponse(categoryService.getAllCategories(), "Get all category success");
    }

}