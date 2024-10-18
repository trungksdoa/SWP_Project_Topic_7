package com.product.server.koi_control_application.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.PondDTO;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IPondService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ponds")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Pond", description = "API for Pond")
public class PondController {
    private final IPondService iPondService;
    private final IImageService iImageService;

    @PostMapping("/{pondId}/maintenance")
    @Operation(summary = "Add maintenance record", description = "Adds a new maintenance record for a specific pond")
    public ResponseEntity<BaseResponse> addMaintenanceRecord(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> maintenanceDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/{pondId}/maintenance-history")
    @Operation(summary = "Get maintenance history", description = "Retrieves the maintenance history for a specific pond")
    public ResponseEntity<BaseResponse> getMaintenanceHistory(@PathVariable int pondId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{pondId}/alert")
    @Operation(summary = "Set pond alert", description = "Sets an alert for a specific pond (e.g., water quality issues)")
    public ResponseEntity<BaseResponse> setPondAlert(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> alertDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/{pondId}/alerts")
    @Operation(summary = "Get pond alerts", description = "Retrieves all active alerts for a specific pond")
    public ResponseEntity<BaseResponse> getPondAlerts(@PathVariable int pondId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{pondId}/schedule-maintenance")
    @Operation(summary = "Schedule pond maintenance", description = "Schedules a maintenance task for a specific pond")
    public ResponseEntity<BaseResponse> scheduleMaintenanceTask(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> scheduleDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @Operation(summary = "Transfer fish between ponds", description = "Transfers fish from one pond to another")
    public ResponseEntity<BaseResponse> transferFish(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> transferDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{pondId}/schedule-cleaning")
    @Operation(summary = "Schedule pond cleaning", description = "Schedules a cleaning task for a specific pond")
    public ResponseEntity<BaseResponse> scheduleCleaningTask(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> scheduleDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/{pondId}/fish-count")
    @Operation(summary = "Get fish count", description = "Retrieves the current fish count in a specific pond")
    public ResponseEntity<BaseResponse> getFishCount(@PathVariable int pondId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @PostMapping("/{pondId}/adjust-feeding")
    @Operation(summary = "Adjust feeding schedule", description = "Adjusts the feeding schedule for a specific pond")
    public ResponseEntity<BaseResponse> adjustFeedingSchedule(@PathVariable int pondId, @RequestBody @Valid Map<String, Object> scheduleDTO) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/{pondId}/environmental-data")
    @Operation(summary = "Get environmental data", description = "Retrieves environmental data (temperature, pH, etc.) for a specific pond")
    public ResponseEntity<BaseResponse> getEnvironmentalData(@PathVariable int pondId) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    @GetMapping("/search")
    @Operation(summary = "Search koi fish", description = "Searches for koi fish based on various criteria")
    public ResponseEntity<BaseResponse> searchKoiFish(@RequestParam Map<String, String> searchParams) {
        throw new UnsupportedOperationException("This method is not implemented yet");
    }

    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createPond(
            @Schema(type = "string", format = "json", implementation = PondDTO.class)
            @RequestPart("pond") String pondJson,
            @RequestParam(value="image", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Pond pond = mapper.readValue(pondJson, Pond.class);




        if(file != null && !file.isEmpty()){
            String filename = iImageService.uploadImage(file);
            pond.setImageUrl(filename);
        }else{
            pond.setImageUrl(iImageService.getDefaultImage("defaultpond.jpg"));
        }
        Pond pond1 = iPondService.addPond(pond);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Create Pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("{pondId}")
    public ResponseEntity<BaseResponse> getPond(@PathVariable("pondId") int pondId) {
        Pond pond1 = iPondService.getPond(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Get Pond succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PutMapping(value = "{pondId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> updatePond(@PathVariable("pondId") int pondId,
                                                   @Schema(type = "string", format = "json", implementation = PondDTO.class)
                                                   @RequestPart("pond") String pondJson, @RequestParam(value="image", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Pond pond = mapper.readValue(pondJson, Pond.class);

        BaseResponse response = BaseResponse.builder()
                .data(iPondService.updatePond(pondId, pond, file))
                .message("Update pond succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("{pondId}")
    public ResponseEntity<BaseResponse> deleteKoiFish(@PathVariable("pondId") int pondId) {

        Pond pond1 = iPondService.getPond(pondId);
        iPondService.deletePond(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Delete pond succesfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //Sửa bởi trung
    @GetMapping("/listpond/byuserid/{userId}")
    public ResponseEntity<BaseResponse> getPondByUserId(@PathVariable("userId") int userId) {
        List<Pond> ponds = iPondService.getAllPondByUserId(userId);
        String mess = "Get ponds by userID succesfully";
        if (ponds.isEmpty())
            mess = "List is empty";
        return ResponseUtil.createSuccessResponse(ponds, mess);
    }

    @GetMapping("/listpond/byuserid/{userId}/page")
    public ResponseEntity<BaseResponse> getPondByUserIdWithPage(@PathVariable("userId") int userId, @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Page<Pond> ponds = iPondService.getAllPondByUserId(userId, page, size);
        String mess = "Get ponds by userID succesfully";
        if (ponds.isEmpty())
            mess = "List is emmty";
        return ResponseUtil.createSuccessResponse(ponds, mess);
    }

    
//Bị  thừa rồi xóa đi nhé
//    @GetMapping("/listpond/page")
//    public ResponseEntity<BaseResponse> getPondWithPage(@RequestParam(defaultValue = "0") int page,
//                                                @RequestParam(defaultValue = "10") int size) {
//        Page<Pond> ponds = iPondService.getPonds(page, size);
//        String mess = "Get all pond succesfully";
//        if (ponds.isEmpty())
//            mess = "List is emmty";
//        return ResponseUtil.createSuccessResponse(ponds, mess);
//    }
//
//    //Add by trung
//    @GetMapping("/listpond")
//    public ResponseEntity<BaseResponse> getPond() {
//        List<Pond> ponds = iPondService.getPonds();
//        String mess = "Get all pond successfully";
//        if (ponds.isEmpty())
//            mess = "List is empty";
//        return ResponseUtil.createSuccessResponse(ponds, mess);
//    }
//    //End add by trung

}
