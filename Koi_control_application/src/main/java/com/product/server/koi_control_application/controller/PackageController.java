package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IPackageService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.product.server.koi_control_application.mappingInterface.PackageMappings.*;

@RestController
@RequestMapping(BASE_PACKAGE)
@RequiredArgsConstructor

@Tag(name = "Package", description = "API for Package")
public class PackageController {
    private final IPackageService packageService;

    @GetMapping(GET_ALL_PACKAGES)
    public ResponseEntity<BaseResponse> getAllPackages() {
        return ResponseUtil.createSuccessResponse(packageService.getAllPackages(), "Success");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<BaseResponse> addPackage(@Valid @RequestBody UserPackage packageRequest) {
        return ResponseUtil.createSuccessResponse(packageService.createPackage(packageRequest), "Success");
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(UPDATE_PACKAGE)
    public ResponseEntity<BaseResponse> updatePackage(@PathVariable int id, @Valid @RequestBody UserPackage packageRequest) {
        return ResponseUtil.createSuccessResponse(packageService.updatePackage(id, packageRequest), "Success");
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(DELETE_PACKAGE)
    public ResponseEntity<BaseResponse> deletePackage(@PathVariable int id) {
        try {
            packageService.deletePackage(id);
            return ResponseUtil.createSuccessResponse("OK", "Success");
        } catch (Exception e) {
            return ResponseUtil.createErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(GET_PACKAGE_BY_ID)
    public ResponseEntity<BaseResponse> getPackageById(@PathVariable int id) {
        return ResponseUtil.createSuccessResponse(packageService.getPackageById(id), "Success");
    }
}
