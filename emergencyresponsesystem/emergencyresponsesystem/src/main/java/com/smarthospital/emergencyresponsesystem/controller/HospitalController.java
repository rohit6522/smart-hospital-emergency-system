package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.entity.Hospital;
import com.smarthospital.emergencyresponsesystem.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @PostMapping
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return hospitalService.addHospital(hospital);
    }

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    @GetMapping("/{id}")
    public Hospital getHospitalById(@PathVariable Long id) {
        return hospitalService.getHospitalById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + id));
    }

    @PutMapping("/{id}")
    public Hospital updateHospital(@PathVariable Long id, @RequestBody Hospital hospital) {
        return hospitalService.updateHospital(id, hospital);
    }

    @DeleteMapping("/{id}")
    public String deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return "Hospital deleted successfully with id: " + id;
    }


    @GetMapping("/nearest")
    public List<com.smarthospital.emergencyresponsesystem.dto.HospitalRecommendation> findNearestHospitals(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam String emergencyType) {
        return hospitalService.findBestHospitals(latitude, longitude, emergencyType);
    }
}