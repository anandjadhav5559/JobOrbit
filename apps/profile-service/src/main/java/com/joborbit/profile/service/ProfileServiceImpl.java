package com.joborbit.profile.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate; // ✅ ADDED
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.joborbit.profile.config.RabbitMQConfig; // ✅ ADDED
import com.joborbit.profile.dto.*;
import com.joborbit.profile.entity.*;
import com.joborbit.profile.event.ProfileEvent; // ✅ ADDED
import com.joborbit.profile.exception.*;
import com.joborbit.profile.repository.ProfileRepository;
import com.joborbit.profile.util.FileValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository repo;
    private final CloudinaryStorageService cloudinaryStorageService;
    private final RabbitTemplate rabbitTemplate; 

    // CREATE 
    @Override
    public Profile createProfile(ProfileAddDTO dto) {

        if (repo.existsByUserId(dto.getUserId())) {
            throw new DuplicateProfileException("Profile already exists for userId: " + dto.getUserId());
        }

        Profile profile = new Profile();
        profile.setUserId(dto.getUserId());
        profile.setHeadline(dto.getHeadline());
        profile.setBio(dto.getBio());
        profile.setLocation(dto.getLocation());
        profile.setSkills(dto.getSkills());

        profile.setExperiences(mapExperiences(dto.getExperiences(), profile));
        profile.setEducations(mapEducations(dto.getEducations(), profile));

        return repo.save(profile);
    }

    // GET 
    @Override
    public Profile getProfile(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));
    }

    @Override
    public Profile getProfileByUserId(Long userId) {
        return repo.getProfileByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with userId: " + userId));
    }

    @Override
    public List<Profile> getAllProfiles() {
        return repo.findAll();
    }

    // UPDATE 
    @Override
    public Profile updateProfile(Long profileId, ProfileUpdateDTO dto) {

        Profile profile = getProfile(profileId);

        profile.setHeadline(dto.getHeadline());
        profile.setBio(dto.getBio());
        profile.setLocation(dto.getLocation());
        profile.setSkills(dto.getSkills());

        profile.removeEducations();
        if (dto.getEducations() != null) {
            dto.getEducations().forEach(e -> {
                Education edu = new Education();
                edu.setInstitution(e.getInstitution());
                edu.setDegree(e.getDegree());
                edu.setStartYear(e.getStartYear());
                edu.setEndYear(e.getEndYear());
                profile.addEducation(edu);
            });
        }

        profile.removeExperiences();
        if (dto.getExperiences() != null) {
            dto.getExperiences().forEach(e -> {
                Experience exp = new Experience();
                exp.setCompanyName(e.getCompanyName());
                exp.setRole(e.getRole());
                exp.setStartDate(e.getStartDate());
                exp.setEndDate(e.getEndDate());
                exp.setDescription(e.getDescription());
                profile.addExperience(exp);
            });
        }

        Profile saved = repo.save(profile);

        // RabbitMQ EVENT
        ProfileEvent event = new ProfileEvent(
                saved.getUserId(),
                saved.getProfilePicUrl()
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.PROFILE_KEY,
                event
        );

        return saved;
    }

    @Override
    public Profile updateHeadline(Long id, HeadlineDTO dto) {
        Profile profile = getProfile(id);
        profile.setHeadline(dto.getHeadline());
        return repo.save(profile);
    }

    @Override
    public Profile updateBio(Long id, BioDTO dto) {
        Profile profile = getProfile(id);
        profile.setBio(dto.getBio());
        return repo.save(profile);
    }

    @Override
    public Profile updateLocation(Long id, LocationDTO dto) {
        Profile profile = getProfile(id);
        profile.setLocation(dto.getLocation());
        return repo.save(profile);
    }

    @Override
    public Profile updateSkills(Long id, SkillAddDTO dto) {
        Profile profile = getProfile(id);
        profile.setSkills(dto.getSkills());
        return repo.save(profile);
    }

    @Override
    public Profile updateExperience(Long id, ExperienceDTO dto) {

        Profile profile = getProfile(id);

        if (profile.getExperiences() == null) {
            profile.setExperiences(new ArrayList<>());
        }

        Experience exp = new Experience();
        exp.setCompanyName(dto.getCompanyName());
        exp.setRole(dto.getRole());
        exp.setStartDate(dto.getStartDate());
        exp.setEndDate(dto.getEndDate());
        exp.setDescription(dto.getDescription());
        exp.setProfile(profile);

        profile.getExperiences().add(exp);

        return repo.save(profile);
    }

    @Override
    public Profile updateEducation(Long id, EducationDTO dto) {

        Profile profile = getProfile(id);

        if (profile.getEducations() == null) {
            profile.setEducations(new ArrayList<>());
        }

        Education edu = new Education();
        edu.setInstitution(dto.getInstitution());
        edu.setDegree(dto.getDegree());
        edu.setFieldOfStudy(dto.getFieldOfStudy());
        edu.setStartYear(dto.getStartYear());
        edu.setEndYear(dto.getEndYear());
        edu.setProfile(profile);

        profile.getEducations().add(edu);

        return repo.save(profile);
    }

    // FILE UPLOAD 
    @Override
    public String uploadProfilePicture(Long id, MultipartFile file) {

        Profile profile = getProfile(id);
        FileValidator.validateImage(file);

        Map<String, String> result =
                cloudinaryStorageService.uploadFile(file, "profile-pics");

        String url = result.get("url");

        profile.setProfilePicUrl(url);
        repo.save(profile);

        // RabbitMQ EVENT
        ProfileEvent event = new ProfileEvent(
                profile.getUserId(),
                url
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.PROFILE_KEY,
                event
        );

        return url;
    }

    @Override
    public String uploadResume(Long id, MultipartFile file) {

        Profile profile = getProfile(id);
        FileValidator.validateResume(file);

        Map<String, String> result =
                cloudinaryStorageService.uploadFile(file, "resumes");

        String url = result.get("url");

        profile.setResumeUrl(url);
        repo.save(profile);

        return url;
    }

    @Override
    public List<String> uploadCertificates(Long id, List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            throw new FileUploadException("No certificate files provided");
        }

        Profile profile = getProfile(id);

        if (profile.getCertificates() == null) {
            profile.setCertificates(new ArrayList<>());
        }

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {

            FileValidator.validateResume(file);

            Map<String, String> result =
                    cloudinaryStorageService.uploadFile(file, "certificates");

            String url = result.get("url");

            Certificate cert = new Certificate();
            cert.setCertificateUrl(url);
            cert.setName(file.getOriginalFilename());
            cert.setProfile(profile);

            profile.getCertificates().add(cert);
            urls.add(url);
        }

        repo.save(profile);
        return urls;
    }

    // DELETE 
    @Override
    public void deleteProfile(Long id) {

        if (!repo.existsById(id)) {
            throw new ProfileNotFoundException("Profile not found with id: " + id);
        }

        repo.deleteById(id);
    }

    // SEARCH 
    @Override
    public List<Profile> searchProfiles(String skills, String location) {

        if (skills != null && location != null) {
            return repo.findBySkillsContainingAndLocationContainingIgnoreCase(skills, location);
        } else if (skills != null) {
            return repo.findBySkillsContaining(skills);
        } else if (location != null) {
            return repo.findByLocationContainingIgnoreCase(location);
        }

        return repo.findAll();
    }

    @Override
    public List<Profile> getByLocation(String location) {
        return repo.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<Profile> getBySkill(String skill) {
        return repo.findBySkillsContaining(skill);
    }

    // MAPPERS 
    private List<Experience> mapExperiences(List<ExperienceDTO> dtos, Profile profile) {
        if (dtos == null) return new ArrayList<>();

        List<Experience> list = new ArrayList<>();
        for (ExperienceDTO dto : dtos) {
            Experience e = new Experience();
            e.setCompanyName(dto.getCompanyName());
            e.setRole(dto.getRole());
            e.setStartDate(dto.getStartDate());
            e.setEndDate(dto.getEndDate());
            e.setDescription(dto.getDescription());
            e.setProfile(profile);
            list.add(e);
        }
        return list;
    }

    private List<Education> mapEducations(List<EducationDTO> dtos, Profile profile) {
        if (dtos == null) return new ArrayList<>();

        List<Education> list = new ArrayList<>();
        for (EducationDTO dto : dtos) {
            Education e = new Education();
            e.setInstitution(dto.getInstitution());
            e.setDegree(dto.getDegree());
            e.setFieldOfStudy(dto.getFieldOfStudy());
            e.setStartYear(dto.getStartYear());
            e.setEndYear(dto.getEndYear());
            e.setProfile(profile);
            list.add(e);
        }
        return list;
    }
}