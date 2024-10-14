package com.product.server.koi_control_application.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.pojo.PondDTO;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IPondService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@RestController
@RequestMapping("/api/ponds")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
@Tag(name = "Pond", description = "API for Pond")
public class PondController {
    private final IPondService iPondService;
    private final IImageService iImageService;

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
