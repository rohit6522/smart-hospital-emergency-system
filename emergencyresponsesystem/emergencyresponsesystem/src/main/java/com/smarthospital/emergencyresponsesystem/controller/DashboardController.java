package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.dto.DashboardStats;
import com.smarthospital.emergencyresponsesystem.entity.Ambulance;
import com.smarthospital.emergencyresponsesystem.entity.Hospital;
import com.smarthospital.emergencyresponsesystem.repository.AmbulanceRepository;
import com.smarthospital.emergencyresponsesystem.repository.EmergencyRequestRepository;
import com.smarthospital.emergencyresponsesystem.repository.HospitalRepository;
import com.smarthospital.emergencyresponsesystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        List<Ambulance> ambulances = ambulanceRepository.findAll();

        long totalIcuBeds = hospitals.stream()
                .mapToLong(h -> h.getTotalIcuBeds() != null ? h.getTotalIcuBeds() : 0)
                .sum();

        long availableIcuBeds = hospitals.stream()
                .mapToLong(h -> h.getAvailableIcuBeds() != null ? h.getAvailableIcuBeds() : 0)
                .sum();

        long availableAmbulances = ambulances.stream()
                .filter(a -> "AVAILABLE".equals(a.getStatus()))
                .count();

        long onDutyAmbulances = ambulances.stream()
                .filter(a -> "ON_DUTY".equals(a.getStatus()))
                .count();

        Map<String, Long> emergencyTypeBreakdown = hospitals.stream()
                .collect(Collectors.groupingBy(Hospital::getEmergencyType, Collectors.counting()));

        Map<String, Long> ambulanceStatusBreakdown = ambulances.stream()
                .collect(Collectors.groupingBy(Ambulance::getStatus, Collectors.counting()));

        return new DashboardStats(
                hospitalRepository.count(),
                patientRepository.count(),
                ambulanceRepository.count(),
                emergencyRequestRepository.count(),
                availableAmbulances,
                onDutyAmbulances,
                totalIcuBeds,
                availableIcuBeds,
                emergencyTypeBreakdown,
                ambulanceStatusBreakdown
        );
    }
}