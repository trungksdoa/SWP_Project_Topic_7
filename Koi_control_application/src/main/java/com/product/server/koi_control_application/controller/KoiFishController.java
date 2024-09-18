package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IKoiFishService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/koifishs")
@RequiredArgsConstructor
@Validated
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class KoiFishController {
    @Autowired
    private IKoiFishService iKoiFishService;

    @PostMapping
    public ResponseEntity<BaseResponse> createKoi(@RequestBody @Valid KoiFish koiFish){
        KoiFish koiFish1 = iKoiFishService.addKoiFish(koiFish);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Create koifish succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("{koiFishId}")
    public ResponseEntity<BaseResponse> getKoi(@PathVariable("koiFishId") int koiFishId){
        KoiFish koiFish1 = iKoiFishService.getKoiFish(koiFishId);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Get koifish succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @PutMapping("{koiFishId}")
    public ResponseEntity<BaseResponse> updateKoiFish(@PathVariable("koiFishId") int koiFishId,@RequestBody @Valid  KoiFishUpdateRequest request){
        KoiFish koiFish1 = iKoiFishService.updateKoiFish(koiFishId,request);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Update koifish succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @DeleteMapping("{koiFishId}")
    public ResponseEntity<BaseResponse> deleteKoiFish(@PathVariable("koiFishId") int koiFishId){
        KoiFish koiFish1 = iKoiFishService.getKoiFish(koiFishId);
        iKoiFishService.deleteKoiFish(koiFishId);

        BaseResponse response = BaseResponse.builder()
                .data(koiFish1)
                .message("Delete koifish succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("/listkoi/bypondid/{pondId}")
    public ResponseEntity<BaseResponse> getKoisByPondId(@PathVariable("pondId") int koiFishId){
         Page<KoiFish> koiFishs = iKoiFishService.getKoiFishsByPondId(koiFishId,0,10);
         String mess="Get koifishs by pondId succesfully";
        if(koiFishs.isEmpty())
            mess="List is emmty";
        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();


        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("/listkoi/byuserid/{userId}")
    public ResponseEntity<BaseResponse> getKoisByUserId(@PathVariable("userId") int userId){
        Page<KoiFish> koiFishs = iKoiFishService.getKoiFishsByUserId(userId,0,10);

        String mess="Get koifishs by userId succesfully";
        if(koiFishs.isEmpty())
            mess="List is emmty";

        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("/listkoi")
    public ResponseEntity<BaseResponse> getKoisByUserId() {
        Page<KoiFish> koiFishs = iKoiFishService.getKoiFishs(0, 10);

        String mess = "Get all koifish succesfully";
        if (koiFishs.isEmpty())
            mess = "List is emmty";

        BaseResponse response = BaseResponse.builder()
                .data(koiFishs)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
