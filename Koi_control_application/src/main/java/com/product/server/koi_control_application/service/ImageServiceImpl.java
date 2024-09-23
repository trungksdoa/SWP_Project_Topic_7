package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.InsufficientException;
import com.product.server.koi_control_application.service_interface.IImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ImageServiceImpl implements IImageService {
    private ClassPathResource imgFile;

    public ImageServiceImpl(ClassPathResource imgFile) {
        this.imgFile = imgFile;
    }
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


    @Override
    public String getDefaultImage(){
        return HOST + "DefaultAvatar.png";
    }

    @Override
    public List<String> getListImages() throws IOException {
        List<String> imageNames = new ArrayList<>();
        Path dirPath = Paths.get(IMAGE_DIR);

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dirPath)) {
            for (Path path : stream) {
                if (!Files.isDirectory(path)) {
                    imageNames.add(path.getFileName().toString());
                }
            }
        } catch (IOException e) {
            throw new InsufficientException("Error when listing images");
        }
        return imageNames;
    }

    @Override
    public String getFileName(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
    @Override
    public InputStream getImage() throws IOException {
        return imgFile.getInputStream();
    }
    @Override
    public boolean imageExists() {
        return imgFile.exists();
    }

    @Override
    public String updateImage(String filename, MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        if(filename == null){
            throw new BadRequestException("Cannot mapping property in class to get filename, please send correct and enough property");
        }



        filename = filename.substring(filename.lastIndexOf("/") + 1);

        log.info("Updating image: " + filename);

        Path imagePath = Paths.get(IMAGE_DIR, filename);
        if (!Files.exists(imagePath)) {
            throw new IOException("Image not found: " + filename);
        }

        // Delete the existing file
        Files.delete(imagePath);

        // Write the new file
        Files.write(imagePath, file.getBytes());

        return HOST + filename;
    }

    @Override
    public void deleteImage(String filename) throws IOException {
        Path filePath = Paths.get(IMAGE_DIR + filename);
        Files.deleteIfExists(filePath);
    }
}

