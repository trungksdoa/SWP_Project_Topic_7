package com.product.server.koi_control_application.service_interface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface IImageService {
    String uploadImage(MultipartFile file) throws IOException;
    InputStream getImage() throws IOException;
    boolean imageExists();
    String updateImage(String filename, MultipartFile file) throws IOException;

    String getDefaultImage();

    List<String> getListImages() throws IOException;

    String getFileName(String url);
    void deleteImage(String filename) throws IOException;

}
