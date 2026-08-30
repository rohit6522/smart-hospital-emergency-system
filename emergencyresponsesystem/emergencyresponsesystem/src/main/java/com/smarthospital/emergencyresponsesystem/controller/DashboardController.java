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
import com.smarthospital.emergencyresponsesystem.entity.EmergencyRequest;
import java.time.Duration;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;


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
                .filter(h -> h.getEmergencyTypes() != null)
                .flatMap(h -> h.getEmergencyTypes().stream())
                .collect(Collectors.groupingBy(type -> type, Collectors.counting()));

        Map<String, Long> ambulanceStatusBreakdown = ambulances.stream()
                .collect(Collectors.groupingBy(Ambulance::getStatus, Collectors.counting()));

        // Calculate average response time (in minutes) per hospital, only for completed requests with both timestamps
        List<EmergencyRequest> completedRequests = emergencyRequestRepository.findAll().stream()
                .filter(r -> r.getRequestTime() != null && r.getCompletionTime() != null && r.getHospitalId() != null)
                .collect(Collectors.toList());

        Map<Long, List<Double>> responseTimesByHospitalId = new java.util.HashMap<>();
        for (EmergencyRequest r : completedRequests) {
            double minutes = Duration.between(r.getRequestTime(), r.getCompletionTime()).toSeconds() / 60.0;
            responseTimesByHospitalId
                    .computeIfAbsent(r.getHospitalId(), k -> new java.util.ArrayList<>())
                    .add(minutes);
        }

        Map<String, Double> avgResponseTimeByHospital = new java.util.HashMap<>();
        for (Map.Entry<Long, List<Double>> entry : responseTimesByHospitalId.entrySet()) {
            hospitalRepository.findById(entry.getKey()).ifPresent(hospital -> {
                double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0);
                avgResponseTimeByHospital.put(hospital.getName(), Math.round(avg * 10.0) / 10.0);
            });
        }
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
                ambulanceStatusBreakdown,
                avgResponseTimeByHospital
        );
    }
}