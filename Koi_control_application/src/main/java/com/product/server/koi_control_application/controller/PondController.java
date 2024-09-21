package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.pojo.PondUpdateRequest;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.pojo.BaseResponse;
import com.product.server.koi_control_application.service_interface.IPondService;
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
@RequestMapping("/api/ponds")
@RequiredArgsConstructor
@Validated
@RolesAllowed({"ROLE_ADMIN", "ROLE_MEMBER", "ROLE_SHOP"})
public class PondController {
    @Autowired
    private IPondService iPondService;

    @PostMapping
    public ResponseEntity<BaseResponse> createPond(@RequestBody @Valid Pond pond){
        Pond    pond1 = iPondService.addPond(pond);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Create Pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
    @GetMapping("{pondId}")
    public ResponseEntity<BaseResponse> getPond(@PathVariable("pondId") int pondId){
        Pond pond1 = iPondService.getPond(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Get Pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }


    @PutMapping("{pondId}")
    public ResponseEntity<BaseResponse> updatePond(@PathVariable("pondId") int pondId,@RequestBody @Valid PondUpdateRequest request){
        Pond pond1 = iPondService.updatePond(pondId,request);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Update pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @DeleteMapping("{pondId}")
    public ResponseEntity<BaseResponse> deleteKoiFish(@PathVariable("pondId") int pondId){

        Pond pond1 = iPondService.getPond(pondId);
        iPondService.deletePond(pondId);

        BaseResponse response = BaseResponse.builder()
                .data(pond1)
                .message("Delete pond succesfully")
                .statusCode(HttpStatus.CREATED.value())
                .build();

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("/listpond/byuserid/{userId}")
    public ResponseEntity<BaseResponse> getPondByUserId(@PathVariable("userId") int userId){
        Page<Pond> Ponds = iPondService.getAllPondByUserId(userId,0,10);
        String mess="Get ponds by userID succesfully";
        if(Ponds.isEmpty())
            mess="List is emmty";
        BaseResponse response = BaseResponse.builder()
                .data(Ponds)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();


        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    @GetMapping("/listpond")
    public ResponseEntity<BaseResponse> getPons(){
        Page<Pond> Ponds = iPondService.getPonds(0,10);
        String mess="Get all pond succesfully";
        if(Ponds.isEmpty())
            mess="List is emmty";
        BaseResponse response = BaseResponse.builder()
                .data(Ponds)
                .message(mess)
                .statusCode(HttpStatus.CREATED.value())
                .build();


        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }


}
