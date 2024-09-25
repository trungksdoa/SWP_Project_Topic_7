package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IPackageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/package")
@RequiredArgsConstructor
public class PackageController {
    private final IPackageService packageService;

    @GetMapping
    public ResponseEntity<BaseResponse> getAllPackages() {
        return ResponseEntity.ok(BaseResponse.builder().data(packageService.getAllPackages()).message("Success").build());
    }

    @PostMapping
    public ResponseEntity<BaseResponse> addPackage(@Valid @RequestBody UserPackage packageRequest) {
        return ResponseEntity.ok(BaseResponse.builder().data(packageService.createPackage(packageRequest)).message("Success").build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse> updatePackage(@PathVariable int id, @Valid @RequestBody UserPackage packageRequest) {
        return ResponseEntity.ok(BaseResponse.builder().data(packageService.updatePackage(id, packageRequest)).message("Success").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse> deletePackage(@PathVariable int id) {
        try {
            packageService.deletePackage(id);
            return ResponseEntity.ok(BaseResponse.builder().data("OK").message("Success").build());
        } catch (Exception e) {
            return new ResponseEntity<>(BaseResponse.builder().data("Error").message(e.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
