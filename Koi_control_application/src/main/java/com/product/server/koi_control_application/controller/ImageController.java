package com.product.server.koi_control_application.controller;


import com.product.server.koi_control_application.service.ImageServiceImpl;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
@Tag(name = "Image", description = "API for image")
public class ImageController {

    private  IImageService imageService;
    private static final String IMAGE_DIR = "image/";

    @GetMapping("/{filename:.+}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String filename) {
        imageService = new ImageServiceImpl(new ClassPathResource(IMAGE_DIR + filename));
        try {
            if (imageService.imageExists()) {
                InputStream in = imageService.getImage();
     
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Hoặc xác định loại MIME dựa trên phần mở rộng của file
                        .body(new InputStreamResource(in));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> listImages() throws IOException {
       if(imageService.getListImages().isEmpty()){
           return ResponseEntity.notFound().build();
       }

        return ResponseEntity.ok(imageService.getListImages());
    }


}
