package com.product.server.koi_control_application;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.export.ConditionalOnEnabledMetricsExport;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

import java.util.TimeZone;


@SpringBootApplication
@EnableAspectJAutoProxy
@Log4j2
@EnableScheduling
@ConditionalOnEnabledMetricsExport("prometheus")
public class KoiControlApplication {


    public static void main(String[] args) {
        SpringApplication.run(KoiControlApplication.class, args);
    }

    @PostConstruct
    public void init() {
        // Setting Spring Boot SetTimeZone
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }



}
