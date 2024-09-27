package com.product.server.koi_control_application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IKoiFishService;
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

@RestController
@RequestMapping("/api/koifishs")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_SHOP')")
public class KoiFishController {

    private final IKoiFishService iKoiFishService;
    private final IImageService iImageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> createKoi(@RequestPart("fish") String koiFishJson, @RequestParam("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        KoiFish koiFish = mapper.readValue(koiFishJson, KoiFish.class);


        String filename = iImageService.uploadImage(file);

        koiFish.setImageUrl(filename);

        KoiFish koiFish1 = iKoiFishService.addKoiFish(koiFish);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Create fish successfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("{koiFishId}")
    public ResponseEntity<BaseResponse> getKoi(@PathVariable("koiFishId") int koiFishId) {
        KoiFish koiFish1 = iKoiFishService.getKoiFish(koiFishId);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Get fish  successfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping(value = "/{koiFishId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse> updateKoiFish(@PathVariable("koiFishId") int koiFishId,
                                                      @RequestPart("fish") @Valid String koiFishJson, @RequestParam("image") MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        KoiFish koiFish = mapper.readValue(koiFishJson, KoiFish.class);

        BaseResponse response = BaseResponse.builder()
                .data(iKoiFishService.updateKoiFish(koiFishId, koiFish, file))
                .message("Update fish successfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("{koiFishId}")
    public ResponseEntity<BaseResponse> deleteKoiFish(@PathVariable("koiFishId") int koiFishId) {
        KoiFish koiFish1 = iKoiFishService.getKoiFish(koiFishId);
        iKoiFishService.deleteKoiFish(koiFishId);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Delete fish successfully")
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/listkoi/bypondid/{pondId}")
    public ResponseEntity<BaseResponse> getKoisByPondId(@PathVariable("pondId") int pondId) {
        Page<KoiFish> koiFishs = iKoiFishService.getKoiFishsByPondId(pondId, 0, 10);
        String mess = "Get koifishs by pondId succesfully";
        if (koiFishs.isEmpty())
            mess = "List is empty";
        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/listkoi/byuserid/{userId}")
    public ResponseEntity<BaseResponse> getKoisByUserId(@PathVariable("userId") int userId) {
        Page<KoiFish> koiFishs = iKoiFishService.getKoiFishsByUserId(userId, 0, 10);

        String mess = "Get fish by userId successfully";
        if (koiFishs.isEmpty())
            mess = "List is empty";

        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/listkoi")
    @PreAuthorize("hasRole({'ROLE_ADMIN', 'ROLE_MEMBER'})")
    public ResponseEntity<BaseResponse> getKoisByUserId() {
        Page<KoiFish> koiFishs = iKoiFishService.getKoiFishs(0, 10);

        String mess = "Get all koifish succesfully";
        if (koiFishs.isEmpty())
            mess = "List is empty";

        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.OK.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/grhis/{koiFishId}")
    public ResponseEntity<BaseResponse> getGrowthHistory(@PathVariable("koiFishId") int koiFishId) {
        KoiGrowthHistory koiGrowthHistory1 = iKoiFishService.getGrowthHistory(koiFishId);
        BaseResponse response = BaseResponse.builder()
                .data(koiGrowthHistory1)
                .message("Get growth history successfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
