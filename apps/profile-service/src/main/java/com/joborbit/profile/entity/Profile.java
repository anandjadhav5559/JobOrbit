package com.joborbit.profile.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String headline;

    @Column(length = 2000)
    private String bio;

    private String location;

    // File URLs
    private String profilePicUrl;
    private String resumeUrl;

    // Skills 
    @ElementCollection
    @CollectionTable(name = "profile_skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    // RELATIONSHIPS 

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Certificate> certificates = new ArrayList<>();

    // EDUCATION HELPERS 

    public void addEducation(Education edu) {
        educations.add(edu);
        edu.setProfile(this);
    }

    public void removeEducations() {
        for (Education edu : educations) {
            edu.setProfile(null);
        }
        educations.clear();
    }

    // EXPERIENCE HELPERS 

    public void addExperience(Experience exp) {
        experiences.add(exp);
        exp.setProfile(this);
    }

    public void removeExperiences() {
        for (Experience exp : experiences) {
            exp.setProfile(null);
        }
        experiences.clear();
    }

    // CERTIFICATE HELPERS 

    public void addCertificate(Certificate cert) {
        certificates.add(cert);
        cert.setProfile(this);
    }

    public void removeCertificates() {
        for (Certificate cert : certificates) {
            cert.setProfile(null);
        }
        certificates.clear();
    }
}