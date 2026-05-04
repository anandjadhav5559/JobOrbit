package com.joborbit.profile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EducationDTO {

    private Long id;

    @NotBlank(message = "Institution is required")
    private String institution;

    private String degree;
    private String fieldOfStudy;
    private String startYear;
    private String endYear;
}