package com.joborbit.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joborbit.profile.entity.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
	Optional<Profile> getProfileByUserId(Long userId);

    boolean existsByUserId(Long userId);

    // SEARCH 

    // Search by skill 
    List<Profile> findBySkillsContaining(String skill);

    // Search by location 
    List<Profile> findByLocationContainingIgnoreCase(String location);

    // Search by both skill + location
    List<Profile> findBySkillsContainingAndLocationContainingIgnoreCase(
            String skill, String location
    );

}
