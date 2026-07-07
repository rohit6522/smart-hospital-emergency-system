package com.smarthospital.emergencyresponsesystem.service;

import com.smarthospital.emergencyresponsesystem.entity.Hospital;
import com.smarthospital.emergencyresponsesystem.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public Hospital addHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> getHospitalById(Long id) {
        return hospitalRepository.findById(id);
    }

    public Hospital updateHospital(Long id, Hospital updatedHospital) {
        updatedHospital.setId(id);
        return hospitalRepository.save(updatedHospital);
    }

    public void deleteHospital(Long id) {
        hospitalRepository.deleteById(id);
    }


    // ================== NEAREST HOSPITAL LOGIC ==================

    public List<com.smarthospital.emergencyresponsesystem.dto.HospitalRecommendation> findBestHospitals(
            Double patientLat, Double patientLon, String emergencyType) {

        List<Hospital> allHospitals = hospitalRepository.findAll();
        List<com.smarthospital.emergencyresponsesystem.dto.HospitalRecommendation> recommendations = new java.util.ArrayList<>();

        for (Hospital hospital : allHospitals) {
            double distance = calculateDistance(
                    patientLat, patientLon,
                    hospital.getLatitude(), hospital.getLongitude()
            );

            double score = calculateSuitabilityScore(hospital, distance, emergencyType);

            recommendations.add(new com.smarthospital.emergencyresponsesystem.dto.HospitalRecommendation(
                    hospital, distance, score
            ));
        }

        // Sort by score DESCENDING (higher score = better hospital)
        recommendations.sort((a, b) -> Double.compare(b.getSuitabilityScore(), a.getSuitabilityScore()));

        return recommendations;
    }

    // Haversine formula - calculates real distance between two lat/long points on Earth
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // distance in KM
    }

    // Suitability scoring - combines distance + resources + emergency type match
    private double calculateSuitabilityScore(Hospital hospital, double distance, String emergencyType) {
        double score = 100.0;

        // Distance penalty - closer hospital = higher score
        score -= distance * 2;

        // ICU bed availability bonus
        if (hospital.getAvailableIcuBeds() != null) {
            score += hospital.getAvailableIcuBeds() * 3;
        }

        // Blood bank availability bonus
        if (Boolean.TRUE.equals(hospital.getBloodBankAvailable())) {
            score += 10;
        }

        // Doctor availability bonus
        if (hospital.getAvailableDoctors() != null) {
            score += hospital.getAvailableDoctors() * 2;
        }

        // Emergency type exact match bonus (big boost)
        if (hospital.getEmergencyType() != null &&
                hospital.getEmergencyType().equalsIgnoreCase(emergencyType)) {
            score += 25;
        }

        return score;
    }
}