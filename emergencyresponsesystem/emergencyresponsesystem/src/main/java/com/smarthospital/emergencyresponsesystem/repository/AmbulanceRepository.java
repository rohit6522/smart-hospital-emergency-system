package com.smarthospital.emergencyresponsesystem.repository;

import com.smarthospital.emergencyresponsesystem.entity.Ambulance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {
}