package com.joborbit.feed.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryStorageService {

    @Autowired
    private Cloudinary cloudinary;

    // UPLOAD FILE 
    public Map<String, String> uploadFile(MultipartFile file, String folder) {

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "joborbit/" + folder
                    )
            );

            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            return Map.of(
                    "url", url,
                    "publicId", publicId
            );

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage());
        }
    }

    // DELETE FILE 
    public void deleteFile(String publicId) {

        try {
            if (publicId == null || publicId.isBlank()) return;

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary delete failed: " + e.getMessage());
        }
    }
}