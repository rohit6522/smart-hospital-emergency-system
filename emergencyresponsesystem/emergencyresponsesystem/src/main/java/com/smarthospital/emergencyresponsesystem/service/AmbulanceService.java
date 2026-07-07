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

    public void deleteAmbulance(Long id) {
        ambulanceRepository.deleteById(id);
    }
}