package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.model.WaterQualityStandard;
import com.product.server.koi_control_application.pojo.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IPondService;

import com.product.server.koi_control_application.serviceInterface.IWaterParameterService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ponds/parameters")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_CONTRIBUTOR')")
@Tag(name = "WaterParameter", description = "API for WaterParameter")
public class WaterParameterController {

    private final IWaterParameterService iWaterParameterService;
    private final IPondService iPondService;

    @PostMapping("{pondId}")
    public ResponseEntity<BaseResponse> addWaterParameter(@PathVariable("pondId") int pondId, @RequestBody @Valid WaterParameter request) {
        WaterParameter waterParameter1 = iWaterParameterService.saveWaterParameter(pondId, request);

        BaseResponse response = BaseResponse.builder()
                .data(waterParameter1)
                .message("Create WaterParameter succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("{pondId}")
    public ResponseEntity<BaseResponse> getWaterParameterByPondId(@PathVariable("pondId") int pondId) {
        WaterParameter waterParameter1 = iWaterParameterService.getWaterParameterByPondId(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(waterParameter1)
                .message("Get WaterParameter succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("{pondId}")
    public ResponseEntity<BaseResponse> updateWaterParameterByPondId(@PathVariable("pondId") int pondId, @RequestBody @Valid WaterParameterUpdateRequest request) {
        WaterParameter waterParameter1 = iWaterParameterService.updateWaterParameter(pondId,request);

        BaseResponse response = BaseResponse.builder()
                .data(waterParameter1)
                .message("Update WaterParameter succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @DeleteMapping("{pondId}")
    public ResponseEntity<BaseResponse> deleteWaterParameterByPondId(@PathVariable("pondId") int pondId) {
        iWaterParameterService.deleteWaterParameter(pondId);

        BaseResponse response = BaseResponse.builder()
                .message("Delete WaterParameter succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/standard/{pondId}")
    public ResponseEntity<BaseResponse> getWaterStandardByPondId(@PathVariable("pondId") int pondId) {
        WaterQualityStandard   waterQualityStandard1 = iWaterParameterService.getWaterQualityByPondId(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(waterQualityStandard1)
                .message("Get WaterStandard succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
