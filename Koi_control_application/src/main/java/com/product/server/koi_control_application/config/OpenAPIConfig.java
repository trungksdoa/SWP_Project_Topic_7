package com.product.server.koi_control_application.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
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
                .tags(List.of(
                        new Tag().name("User").description("API for user"),
                        new Tag().name("Product").description("API for Product"),
                        new Tag().name("Blog").description("API for blog"),
                        new Tag().name("PaymentStatus").description("API for PaymentStatus"),
                        new Tag().name("PaymentStatus").description("API for payment"),
                        new Tag().name("WaterParameter").description("API for WaterParameter"),
                        new Tag().name("Order").description("API for order"),
                        new Tag().name("Cart").description("API for cart"),
                        new Tag().name("Category").description("API for Category"),
                        new Tag().name("Package").description("API for Package"),
                        new Tag().name("Feedback").description("APIs for managing feedbacks"),
                        new Tag().name("KoiFish").description("API for KoiFish"),
                        new Tag().name("Pond").description("API for Pond"),
                        new Tag().name("Image").description("API for image"),
                        new Tag().name("Admin API").description("API for admin")
                ))
                .info(new Info().title(title)
                        .description("API for managing koi fish control system")
                        .version(version)
                        .contact(new Contact().name("Your Name").email("your.email@example.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .servers(List.of(new Server().url(serverUrl), new Server().url("http://localhost:8080")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )

                );

    }
}