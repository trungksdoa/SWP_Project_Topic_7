package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.dto.BaseResponse;
import com.product.server.koi_control_application.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final IUserService userService;

    @RequestMapping(value = "/fetchUser", method = RequestMethod.GET)
    public ResponseEntity<BaseResponse> getUsers(@RequestParam int userId) {
        BaseResponse response = BaseResponse.builder()
                .data(userService.getUser(userId))
                .statusCode(HttpStatus.OK.value())
                .message("Success")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public ResponseEntity<BaseResponse> testing() {
        BaseResponse response = BaseResponse.builder()
                .data("helloClient")
                .statusCode(HttpStatus.OK.value())
                .message("Success")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
