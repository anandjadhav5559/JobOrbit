package com.joborbit.profile.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.joborbit.profile.dto.*;
import com.joborbit.profile.entity.Profile;

public interface ProfileService {
  
	// GET
    Profile createProfile(ProfileAddDTO dto);

    Profile getProfile(Long id);

    Profile getProfileByUserId(Long userId);

    List<Profile> getAllProfiles();

    // UPDATE 
    Profile updateProfile(Long profileId, ProfileUpdateDTO dto);

    Profile updateHeadline(Long id, HeadlineDTO dto);

    Profile updateBio(Long id, BioDTO dto);

    Profile updateLocation(Long id, LocationDTO dto);

    Profile updateSkills(Long id, SkillAddDTO dto);

    Profile updateExperience(Long id, ExperienceDTO dto);

    Profile updateEducation(Long id, EducationDTO dto);

    // FILE UPLOAD 
    String uploadProfilePicture(Long profileId, MultipartFile file);

    String uploadResume(Long profileId, MultipartFile file);

    List<String> uploadCertificates(Long profileId, List<MultipartFile> files);

    // DELETE 
    void deleteProfile(Long id);

    // SEARCH 
    List<Profile> searchProfiles(String skills, String location);

    List<Profile> getByLocation(String location);

    List<Profile> getBySkill(String skill);
}