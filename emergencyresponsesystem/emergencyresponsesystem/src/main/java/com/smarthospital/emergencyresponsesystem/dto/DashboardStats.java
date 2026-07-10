package com.smarthospital.emergencyresponsesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalHospitals;
    private long totalPatients;
    private long totalAmbulances;
    private long totalEmergencyRequests;
    private long availableAmbulances;
    private long onDutyAmbulances;
    private long totalIcuBeds;
    private long availableIcuBeds;
    private Map<String, Long> emergencyTypeBreakdown;
    private Map<String, Long> ambulanceStatusBreakdown;
}