package com.smarthospital.emergencyresponsesystem.service;

import com.smarthospital.emergencyresponsesystem.entity.Ambulance;
import com.smarthospital.emergencyresponsesystem.repository.AmbulanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AmbulanceService {

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    public Ambulance addAmbulance(Ambulance ambulance) {
        return ambulanceRepository.save(ambulance);
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    public Optional<Ambulance> getAmbulanceById(Long id) {
        return ambulanceRepository.findById(id);
    }

    public Ambulance updateAmbulance(Long id, Ambulance updatedAmbulance) {
        updatedAmbulance.setId(id);
        return ambulanceRepository.save(updatedAmbulance);
    }

    /**
     * AI-based Auto-Dispatch: finds the nearest AVAILABLE ambulance to a given
     * location using a greedy nearest-neighbor assignment algorithm, then
     * marks it ON_DUTY and links it to the hospital.
     */
    public Ambulance autoDispatch(Double patientLat, Double patientLon, Long hospitalId) {
        List<Ambulance> availableAmbulances = ambulanceRepository.findAll().stream()
                .filter(a -> "AVAILABLE".equalsIgnoreCase(a.getStatus()))
                .filter(a -> a.getCurrentLatitude() != null && a.getCurrentLongitude() != null)
                .collect(java.util.stream.Collectors.toList());

        if (availableAmbulances.isEmpty()) {
            return null;
        }

        Ambulance nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Ambulance ambulance : availableAmbulances) {
            double distance = calculateDistance(
                    patientLat, patientLon,
                    ambulance.getCurrentLatitude(), ambulance.getCurrentLongitude()
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearest = ambulance;
            }
        }

        if (nearest != null) {
            nearest.setStatus("ON_DUTY");
            nearest.setAssignedHospitalId(hospitalId);
            return ambulanceRepository.save(nearest);
        }

        return null;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public void deleteAmbulance(Long id) {
        ambulanceRepository.deleteById(id);
    }
}