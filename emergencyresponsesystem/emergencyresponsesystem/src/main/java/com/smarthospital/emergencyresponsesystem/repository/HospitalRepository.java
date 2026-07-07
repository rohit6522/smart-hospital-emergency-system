package com.smarthospital.emergencyresponsesystem.repository;

import com.smarthospital.emergencyresponsesystem.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
}