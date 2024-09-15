package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.serviceInterface.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements IImageService {

    private static final String IMAGE_DIR = "image/";
    private static final String HOST ="https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/image/";
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        Path dirPath = Paths.get(IMAGE_DIR);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = dirPath.resolve(filename);

        Files.write(filePath, file.getBytes());

        return HOST+filename;
    }
}

