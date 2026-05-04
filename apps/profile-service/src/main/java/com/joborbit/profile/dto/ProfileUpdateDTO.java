package com.joborbit.profile.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateDTO {

    private String headline;
    private String bio;
    private String location;
    private List<String> skills;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
}