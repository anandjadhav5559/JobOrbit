package com.joborbit.profile.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileAddDTO {

    private Long userId;

    @NotBlank(message = "Headline is required")
    private String headline;

    @NotBlank(message = "Bio is required")
    private String bio;

    private String location;

    private List<String> skills;

    private List<ExperienceDTO> experiences;

    private List<EducationDTO> educations;
}