package com.product.server.koi_control_application.controller;

import com.product.server.koi_control_application.serviceInterface.IKoiFishService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIReport {
    private final IKoiFishService iKoiFishService;
//    private final MLService mlService;

//
//    @GetMapping("/{koiFishId}/predict-growth-and-feeding")
//    public ResponseEntity<BaseResponse> predictGrowthAndFeeding(@PathVariable("koiFishId") int koiFishId) {
//        KoiFish koiFish = iKoiFishService.getKoiFish(koiFishId);
//        Map<String, Object> prediction = mlService.predictGrowthAndFeeding(koiFishId);
//
//        BaseResponse response = BaseResponse.builder()
//                .data(prediction)
//                .message("Growth prediction and feeding recommendation generated successfully")
//                .statusCode(HttpStatus.OK.value())
//                .build();
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

}
