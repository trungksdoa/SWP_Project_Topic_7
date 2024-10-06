package com.product.server.koi_control_application;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@EnableAspectJAutoProxy
@Log4j2
@EnableRetry
public class KoiControlApplication {


    public static void main(String[] args) {
        SpringApplication.run(KoiControlApplication.class, args);
    }
}
