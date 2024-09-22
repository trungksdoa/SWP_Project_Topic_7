package com.product.server.koi_control_application.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IPondService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ponds")
@RequiredArgsConstructor
@Validated
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class PondController {
    private final IPondService iPondService;
    private final IImageService iImageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createPond(@RequestPart("pond") String pondJson, @RequestParam("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        Pond pond = mapper.readValue(pondJson, Pond.class);

        String filename = iImageService.uploadImage(file);

        pond.setImageUrl(filename);

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
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @PutMapping(value = "{pondId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> updatePond(@PathVariable("pondId") int pondId, @RequestPart("pond") String pondJson, @RequestParam("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        Pond pond = mapper.readValue(pondJson, Pond.class);

        BaseResponse response = BaseResponse.builder()
                .data(iPondService.updatePond(pondId, pond, file))
                .message("Update pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("{pondId}")
    public ResponseEntity<BaseResponse> deleteKoiFish(@PathVariable("pondId") int pondId) {

        Pond pond1 = iPondService.getPond(pondId);
        iPondService.deletePond(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Delete pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/listpond/byuserid/{userId}")
    public ResponseEntity<BaseResponse> getPondByUserId(@PathVariable("userId") int userId) {
        Page<Pond> Ponds = iPondService.getAllPondByUserId(userId, 0, 10);
        String mess = "Get ponds by userID succesfully";
        if (Ponds.isEmpty())
            mess = "List is emmty";
        BaseResponse response = BaseResponse.builder()
                .data(Ponds)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/listpond")
    public ResponseEntity<BaseResponse> getPons() {
        Page<Pond> Ponds = iPondService.getPonds(0, 10);
        String mess = "Get all pond succesfully";
        if (Ponds.isEmpty())
            mess = "List is emmty";
        BaseResponse response = BaseResponse.builder()
                .data(Ponds)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
