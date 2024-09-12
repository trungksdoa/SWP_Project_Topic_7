package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.dto.BaseResponse;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final IUserService userService;

    @RequestMapping(value = "/fetchUser", method = RequestMethod.GET)
    public ResponseEntity<BaseResponse> getUser(@RequestParam int userId) {
        BaseResponse response = BaseResponse.builder().data(userService.getUser(userId)).statusCode(HttpStatus.OK.value()).message("Success").build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<BaseResponse> registerUser(@RequestBody Users users) {
        BaseResponse response;
        try {
            userService.saveUser(users);
            response = BaseResponse.builder().data(users).statusCode(HttpStatus.CREATED.value()).message("Success").build();
        } catch (Exception e) {
            response = BaseResponse.builder().data("No response").statusCode(HttpStatus.BAD_REQUEST.value()).message("Failed").build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<BaseResponse>  userLogin(@RequestBody String username, @RequestBody String password) {
        BaseResponse response;
        try{
            response = BaseResponse.builder().data(userService.userLogin(username, password)).statusCode(HttpStatus.OK.value()).message("Success").build();
        }catch (Exception e){
            response = BaseResponse.builder().data("No response").statusCode(HttpStatus.BAD_REQUEST.value()).message("Failed").build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
