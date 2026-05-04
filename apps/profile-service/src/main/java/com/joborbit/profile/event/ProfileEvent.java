package com.joborbit.profile.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileEvent {
    private Long userId;
    private String profilePicUrl;
}