package com.joborbit.profile.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryStorageService {

    private final Cloudinary cloudinary;

    // UPLOAD FILE 
    public Map<String, String> uploadFile(MultipartFile file, String folder) {

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "joborbit/" + folder
                    )
            );

            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            Map<String, String> result = new HashMap<>();
            result.put("url", url);
            result.put("publicId", publicId);

            return result;

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