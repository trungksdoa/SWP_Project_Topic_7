package com.product.server.koi_control_application.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IImageService {
    String uploadImage(MultipartFile file) throws IOException;
}
