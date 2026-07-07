package com.smarthospital.emergencyresponsesystem.dto;

import com.smarthospital.emergencyresponsesystem.entity.Hospital;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalRecommendation {
    private Hospital hospital;
    private Double distanceInKm;
    private Double suitabilityScore;
}