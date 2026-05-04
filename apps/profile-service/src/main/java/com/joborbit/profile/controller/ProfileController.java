package com.joborbit.profile.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.joborbit.profile.dto.*;
import com.joborbit.profile.entity.Profile;
import com.joborbit.profile.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Validated
@CrossOrigin("*")
public class ProfileController {

    private final ProfileService service;

    // CREATE 
    @PostMapping("/create")
    public ResponseEntity<Profile> createProfile(
            @Valid @RequestBody ProfileAddDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        dto.setUserId(userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createProfile(dto));
    }

    // GET 
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProfile(id));
    }

    // GET USER BY UERID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Profile> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getProfileByUserId(userId));
    }

    // GET ALL PROFILES
    @GetMapping
    public ResponseEntity<List<Profile>> getAll(
            @RequestHeader("X-User-Role") String role) {

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied: Admin only");
        }

        return ResponseEntity.ok(service.getAllProfiles());
    }

    // UPDATE BY ID
    @PutMapping("/update/{id}")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody ProfileUpdateDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateProfile(id, dto));
    }

    // UPDATE HEADLINE BY ID
    @PatchMapping("/{id}/headline")
    public ResponseEntity<Profile> updateHeadline(
            @PathVariable Long id,
            @RequestBody HeadlineDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateHeadline(id, dto));
    }

    // UPDATE BIO BY ID
    @PatchMapping("/{id}/bio")
    public ResponseEntity<Profile> updateBio(
            @PathVariable Long id,
            @RequestBody BioDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateBio(id, dto));
    }

    // UPDATE LOCATION BY ID
    @PatchMapping("/{id}/location")
    public ResponseEntity<Profile> updateLocation(
            @PathVariable Long id,
            @RequestBody LocationDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateLocation(id, dto));
    }

    // UPDATE SKILLS BY ID
    @PatchMapping("/{id}/skills")
    public ResponseEntity<Profile> updateSkills(
            @PathVariable Long id,
            @RequestBody SkillAddDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateSkills(id, dto));
    }

 // UPDATE EXPERIENCE BY ID
    @PatchMapping("/{id}/experience")
    public ResponseEntity<Profile> updateExperience(
            @PathVariable Long id,
            @RequestBody ExperienceDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateExperience(id, dto));
    }

    @PatchMapping("/{id}/education")
    public ResponseEntity<Profile> updateEducation(
            @PathVariable Long id,
            @RequestBody EducationDTO dto,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.updateEducation(id, dto));
    }

    // FILE UPLOAD 

    @PostMapping("/{id}/upload/profile-pic")
    public ResponseEntity<String> uploadProfilePic(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.uploadProfilePicture(id, file));
    }

    @PostMapping("/{id}/upload/resume")
    public ResponseEntity<String> uploadResume(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.uploadResume(id, file));
    }

    @PostMapping("/{id}/upload/certificates")
    public ResponseEntity<List<String>> uploadCertificates(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @RequestHeader("X-User-Id") Long userId) {

        validateOwnership(id, userId);
        return ResponseEntity.ok(service.uploadCertificates(id, files));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role) {

        Profile profile = service.getProfile(id);

        if (!profile.getUserId().equals(userId) && !"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied");
        }

        service.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH 
    @GetMapping("/search")
    public ResponseEntity<List<Profile>> search(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String location) {

        return ResponseEntity.ok(service.searchProfiles(skills, location));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Profile>> getByLocation(@PathVariable String location) {
        return ResponseEntity.ok(service.getByLocation(location));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<Profile>> getBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(service.getBySkill(skill));
    }

    // HELPER 

    private void validateOwnership(Long profileId, Long userId) {

        Profile profile = service.getProfile(profileId);

        if (!profile.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }
    }
}