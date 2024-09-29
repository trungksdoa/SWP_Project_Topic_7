package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IPackageService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/package")
@RequiredArgsConstructor

@Tag(name = "Package", description = "API for Package")
public class PackageController {
    private final IPackageService packageService;

    @GetMapping("/list")
    public ResponseEntity<BaseResponse> getAllPackages() {
        return ResponseUtil.createSuccessResponse(packageService.getAllPackages(), "Success");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<BaseResponse> addPackage(@Valid @RequestBody UserPackage packageRequest) {
        return ResponseUtil.createSuccessResponse(packageService.createPackage(packageRequest), "Success");
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updatePackage(@PathVariable int id, @Valid @RequestBody UserPackage packageRequest) {
        return ResponseUtil.createSuccessResponse(packageService.updatePackage(id, packageRequest), "Success");
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deletePackage(@PathVariable int id) {
        try {
            packageService.deletePackage(id);
            return ResponseUtil.createSuccessResponse("OK", "Success");
        } catch (Exception e) {
            return ResponseUtil.createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
