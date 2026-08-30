package com.smarthospital.emergencyresponsesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeverityResponse {
    private String severity;
    private int score;
    private List<String> matchedSymptoms;
    private String recommendation;
}