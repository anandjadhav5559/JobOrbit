package com.joborbit.profile.util;

import org.springframework.web.multipart.MultipartFile;
import com.joborbit.profile.exception.FileUploadException;

import java.util.List;

public class FileValidator {

    private static final List<String> IMAGE_TYPES = List.of(
            "image/jpeg",
            "image/png"
    );

    private static final List<String> RESUME_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public static void validateImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Image file is empty");
        }

        String contentType = file.getContentType();

        if (contentType == null || !IMAGE_TYPES.contains(contentType)) {
            throw new FileUploadException("Only JPG/PNG images are allowed");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            throw new FileUploadException("Image size must be less than 2MB");
        }
    }

    public static void validateResume(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Resume file is empty");
        }

        String contentType = file.getContentType();

        if (contentType == null || !RESUME_TYPES.contains(contentType)) {
            throw new FileUploadException("Only PDF/DOC/DOCX files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new FileUploadException("Resume size must be less than 5MB");
        }
    }
}