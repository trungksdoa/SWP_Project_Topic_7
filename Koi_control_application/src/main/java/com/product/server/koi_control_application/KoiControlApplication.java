package com.product.server.koi_control_application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class KoiControlApplication {


    @Autowired
    public static void main(String[] args) {
        SpringApplication.run(KoiControlApplication.class, args);
    }


}
