package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IWaterParameterService;
import jakarta.annotation.security.RolesAllowed;
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
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
public class WaterParameterController {

    private final IWaterParameterService iWaterParameterService;

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
                .message("Create WaterParameter succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("{pondId}")
    public ResponseEntity<BaseResponse> updateWaterParameterByPondId(@PathVariable("pondId") int pondId, @RequestBody @Valid WaterParameterUpdateRequest request) {
        WaterParameter waterParameter1 = iWaterParameterService.updateWaterParameter(pondId,request);

        BaseResponse response = BaseResponse.builder()
                .data(waterParameter1)
                .message("Create WaterParameter succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
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


}
