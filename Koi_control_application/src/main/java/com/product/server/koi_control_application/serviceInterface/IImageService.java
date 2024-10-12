package com.product.server.koi_control_application.serviceInterface;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * This interface defines the contract for image-related operations.
 * It provides methods for uploading, retrieving, updating, and deleting images,
 * as well as checking for image existence and listing images.
 */
public interface IImageService {

    /**
     * Uploads an image file.
     *
     * @param file The MultipartFile representing the image to be uploaded.
     * @return     The filename of the uploaded image.
     * @throws IOException If an error occurs during the upload process.
     */
    String uploadImage(MultipartFile file) throws IOException;

    /**
     * Retrieves an image as an InputStream.
     *
     * @return An InputStream for the image.
     * @throws IOException If an error occurs while retrieving the image.
     */
    InputStream getImage() throws IOException;

    /**
     * Checks if an image exists.
     *
     * @return true if the image exists; false otherwise.
     */
    boolean imageExists();

    /**
     * Updates an existing image with a new file.
     *
     * @param filename The name of the existing image file to be updated.
     * @param file     The MultipartFile representing the new image.
     * @return        The filename of the updated image.
     * @throws IOException If an error occurs during the update process.
     */
    String updateImage(String filename, MultipartFile file) throws IOException;

    /**
     * Retrieves the default image filename.
     *
     * @return The filename of the default image.
     */
    String getDefaultImage(String fileName);

    /**
     * Retrieves a list of all image filenames.
     *
     * @return A List of image filenames.
     * @throws IOException If an error occurs while retrieving the list of images.
     */
    List<String> getListImages() throws IOException;

    /**
     * Extracts the filename from a given URL.
     *
     * @param url The URL of the image.
     * @return    The filename extracted from the URL.
     */
    String getFileName(String url);

    /**
     * Deletes an image by its filename.
     *
     * @param filename The name of the image file to be deleted.
     * @throws IOException If an error occurs during the deletion process.
     */
    void deleteImage(String filename) throws IOException;
}