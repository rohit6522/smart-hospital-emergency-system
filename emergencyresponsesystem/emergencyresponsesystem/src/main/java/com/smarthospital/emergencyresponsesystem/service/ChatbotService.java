package com.smarthospital.emergencyresponsesystem.service;

import com.smarthospital.emergencyresponsesystem.dto.ChatResponse;
import com.smarthospital.emergencyresponsesystem.repository.AmbulanceRepository;
import com.smarthospital.emergencyresponsesystem.repository.HospitalRepository;
import com.smarthospital.emergencyresponsesystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ChatbotService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    @Autowired
    private PatientRepository patientRepository;

    // Intent lexicon: maps trigger keywords -> intent name (rule-based NLP intent classification)
    private static final Map<String, String> INTENT_KEYWORDS = new LinkedHashMap<>();

    static {
        INTENT_KEYWORDS.put("hi|hello|hey|namaste", "greeting");
        INTENT_KEYWORDS.put("thank|thanks|thankyou", "thanks");
        INTENT_KEYWORDS.put("how many hospital|total hospital|number of hospital", "hospital_count");
        INTENT_KEYWORDS.put("how many ambulance|total ambulance|number of ambulance", "ambulance_count");
        INTENT_KEYWORDS.put("how many patient|total patient|number of patient", "patient_count");
        INTENT_KEYWORDS.put("nearest hospital|find hospital|best hospital|which hospital", "nearest_hospital");
        INTENT_KEYWORDS.put("blood bank|blood group|blood availab", "blood_bank");
        INTENT_KEYWORDS.put("add patient|register patient|new patient", "add_patient");
        INTENT_KEYWORDS.put("emergency number|ambulance number|helpline|call number", "emergency_number");
        INTENT_KEYWORDS.put("symptom|severity|how sick|pain", "severity_check");
        INTENT_KEYWORDS.put("track ambulance|ambulance status|live ambulance", "ambulance_tracking");
        INTENT_KEYWORDS.put("sos|panic|urgent help", "sos_info");
        INTENT_KEYWORDS.put("who are you|what are you|your name", "identity");
    }

    public ChatResponse getResponse(String message) {
        if (message == null || message.trim().isEmpty()) {
            return new ChatResponse("Please type a message so I can help you.", "empty");
        }

        String normalized = message.toLowerCase();
        String matchedIntent = "fallback";

        for (Map.Entry<String, String> entry : INTENT_KEYWORDS.entrySet()) {
            String[] patterns = entry.getKey().split("\\|");
            for (String pattern : patterns) {
                if (normalized.contains(pattern)) {
                    matchedIntent = entry.getValue();
                    break;
                }
            }
            if (!matchedIntent.equals("fallback")) break;
        }

        return new ChatResponse(buildReply(matchedIntent), matchedIntent);
    }

    private String buildReply(String intent) {
        switch (intent) {
            case "greeting":
                return "Hello! 👋 I'm your Smart Hospital AI Assistant. Ask me about nearest hospitals, ambulances, blood banks, or how to use this system.";
            case "thanks":
                return "You're welcome! Stay safe. 🚑";
            case "hospital_count":
                return "We currently have " + hospitalRepository.count() + " hospitals registered in the system.";
            case "ambulance_count":
                long available = ambulanceRepository.findAll().stream()
                        .filter(a -> "AVAILABLE".equalsIgnoreCase(a.getStatus())).count();
                return "There are " + ambulanceRepository.count() + " ambulances in total, and " + available + " currently AVAILABLE.";
            case "patient_count":
                return "We have " + patientRepository.count() + " patient records in the system.";
            case "nearest_hospital":
                return "To find the nearest hospital, go to the 'Request Emergency' page, share or search your location, and our AI will rank hospitals by distance, ICU beds, blood bank, and doctor availability.";
            case "blood_bank":
                return "Each hospital's blood bank inventory (by blood group) is visible on the Hospitals page. Admins can update live blood unit counts there.";
            case "add_patient":
                return "Admins can add a new patient from the Patients page using the '+ Add New Patient' button. Our AI also checks for duplicate records automatically.";
            case "emergency_number":
                return "For immediate help: 🚑 Ambulance - 102, 🚓 National Emergency - 112.";
            case "severity_check":
                return "On the Request Emergency page, describe your symptoms in the AI Severity Check box — I'll automatically classify it as Critical, Moderate, or Mild.";
            case "ambulance_tracking":
                return "You can see live ambulance status on the Ambulances page — it updates in real time via WebSocket, so you'll always see the latest status.";
            case "sos_info":
                return "Tap the red 🚨 SOS button (bottom-right corner) for one-tap emergency — it detects your location and finds the nearest hospital instantly, no form needed.";
            case "identity":
                return "I'm the Smart Hospital AI Assistant — a rule-based NLP chatbot built to help you navigate emergency services quickly.";
            default:
                return "I'm still learning! For urgent help, please use the 🚨 SOS button or the Request Emergency page. You can ask me about hospitals, ambulances, blood banks, or emergency numbers.";
        }
    }
}