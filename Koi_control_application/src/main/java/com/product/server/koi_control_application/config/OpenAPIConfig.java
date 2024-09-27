package com.product.server.koi_control_application.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {
    @Value("${openapi.service.title}")
    private String title;

    @Value("${openapi.service.version}")
    private String version;

    @Value("${openapi.service.server.url}")
    private String serverUrl;

    @Bean
    public OpenAPI koiControlOpenAPI() {
        return new OpenAPI()
                .info(new Info().title(title)
                        .description("API for managing koi fish control system")
                        .version(version)
                        .contact(new Contact().name("Your Name").email("your.email@example.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .servers(List.of(new Server().url(serverUrl)));
    }
}