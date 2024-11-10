package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.mappingInterface.SearchMapping;
import com.product.server.koi_control_application.model.Product;
import com.product.server.koi_control_application.pojo.response.BaseResponse;
import com.product.server.koi_control_application.serviceInterface.IOrderService;
import com.product.server.koi_control_application.serviceInterface.IProductService;
import com.product.server.koi_control_application.serviceInterface.IUserService;
import com.product.server.koi_control_application.ultil.ResponseUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.product.server.koi_control_application.mappingInterface.SearchMapping.*;

@RestController
@RequestMapping(BASE_SEARCH)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Search", description = "API for searching data")
public class SearchController {
    private final IProductService productService;
    private final IOrderService orderService;
    private final IUserService userService;
//
    @PostMapping(GET_PRODUCT_BY_NAME)
    public ResponseEntity<BaseResponse> getProductByName(@RequestParam String name) {
        List<Product> products = productService.searchProductByName(name);
        return ResponseUtil.createSuccessResponse(products,"Search product by name successfully");
    }
////
////    @PostMapping(GET_USER_BY_ADDRESS)
////    public void getUserByAddress() {
////        throw new UnsupportedOperationException("This method is not implemented yet");
////    }
////
////    @PostMapping(GET_USER_BY_EMAIL)
////    public void getUserByEmail() {
////        throw new UnsupportedOperationException("This method is not implemented yet");
////    }
////
////    @PostMapping(GET_USER_BY_NAME)
////    public void getUserByName() {
////        throw new UnsupportedOperationException("This method is not implemented yet");
////    }
////
////    @PostMapping(GET_USER_BY_PHONE)
////    public void getUserByPhone() {
////        throw new UnsupportedOperationException("This method is not implemented yet");
////    }
//
//
}
