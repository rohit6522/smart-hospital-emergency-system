package com.smarthospital.emergencyresponsesystem.repository;

import com.smarthospital.emergencyresponsesystem.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}