package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.dto.SeverityRequest;
import com.smarthospital.emergencyresponsesystem.dto.SeverityResponse;
import com.smarthospital.emergencyresponsesystem.service.SeverityClassifierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class SeverityController {

    @Autowired
    private SeverityClassifierService severityClassifierService;

    @PostMapping("/classify-severity")
    public SeverityResponse classifySeverity(@RequestBody SeverityRequest request) {
        SeverityClassifierService.SeverityResult result = severityClassifierService.classify(request.getSymptoms());

        String recommendation;
        switch (result.severity) {
            case "CRITICAL":
                recommendation = "Immediate ambulance dispatch recommended. Prioritize hospitals with ICU and trauma capability.";
                break;
            case "MODERATE":
                recommendation = "Prompt medical attention recommended within the hour.";
                break;
            case "MILD":
                recommendation = "Non-urgent. Visit nearest general hospital or clinic.";
                break;
            default:
                recommendation = "Please provide more details about the symptoms.";
        }

        return new SeverityResponse(result.severity, result.score, result.matchedSymptoms, recommendation);
    }
}