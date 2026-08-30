package com.smarthospital.emergencyresponsesystem.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SeverityClassifierService {

    // Keyword-weighted lexicon for AI-based text classification (rule-based NLP)
    private static final Map<String, Integer> SYMPTOM_WEIGHTS = new HashMap<>();

    static {
        // Critical indicators (high weight)
        SYMPTOM_WEIGHTS.put("unconscious", 10);
        SYMPTOM_WEIGHTS.put("not breathing", 10);
        SYMPTOM_WEIGHTS.put("no pulse", 10);
        SYMPTOM_WEIGHTS.put("severe bleeding", 9);
        SYMPTOM_WEIGHTS.put("heavy bleeding", 9);
        SYMPTOM_WEIGHTS.put("chest pain", 8);
        SYMPTOM_WEIGHTS.put("difficulty breathing", 8);
        SYMPTOM_WEIGHTS.put("shortness of breath", 8);
        SYMPTOM_WEIGHTS.put("stroke", 9);
        SYMPTOM_WEIGHTS.put("seizure", 8);
        SYMPTOM_WEIGHTS.put("severe burn", 8);
        SYMPTOM_WEIGHTS.put("head injury", 7);
        SYMPTOM_WEIGHTS.put("paralysis", 8);
        SYMPTOM_WEIGHTS.put("choking", 8);
        SYMPTOM_WEIGHTS.put("heart attack", 10);
        SYMPTOM_WEIGHTS.put("cardiac arrest", 10);

        // Moderate indicators
        SYMPTOM_WEIGHTS.put("fracture", 5);
        SYMPTOM_WEIGHTS.put("broken bone", 5);
        SYMPTOM_WEIGHTS.put("high fever", 4);
        SYMPTOM_WEIGHTS.put("vomiting blood", 6);
        SYMPTOM_WEIGHTS.put("severe pain", 5);
        SYMPTOM_WEIGHTS.put("allergic reaction", 6);
        SYMPTOM_WEIGHTS.put("dizziness", 3);
        SYMPTOM_WEIGHTS.put("burn", 4);
        SYMPTOM_WEIGHTS.put("deep cut", 5);

        // Mild indicators
        SYMPTOM_WEIGHTS.put("mild pain", 2);
        SYMPTOM_WEIGHTS.put("headache", 2);
        SYMPTOM_WEIGHTS.put("nausea", 2);
        SYMPTOM_WEIGHTS.put("minor cut", 1);
        SYMPTOM_WEIGHTS.put("fever", 2);
        SYMPTOM_WEIGHTS.put("cold", 1);
        SYMPTOM_WEIGHTS.put("cough", 1);
    }

    public static class SeverityResult {
        public String severity;
        public int score;
        public List<String> matchedSymptoms;

        public SeverityResult(String severity, int score, List<String> matchedSymptoms) {
            this.severity = severity;
            this.score = score;
            this.matchedSymptoms = matchedSymptoms;
        }
    }

    /**
     * Rule-based NLP classifier: scans free-text symptom description,
     * matches against a weighted medical-keyword lexicon, and classifies
     * severity. This is a lightweight text-classification AI technique.
     */
    public SeverityResult classify(String symptomText) {
        if (symptomText == null || symptomText.trim().isEmpty()) {
            return new SeverityResult("UNKNOWN", 0, new ArrayList<>());
        }

        String normalized = symptomText.toLowerCase();
        int totalScore = 0;
        List<String> matched = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : SYMPTOM_WEIGHTS.entrySet()) {
            if (normalized.contains(entry.getKey())) {
                totalScore += entry.getValue();
                matched.add(entry.getKey());
            }
        }

        String severity;
        if (totalScore >= 8) {
            severity = "CRITICAL";
        } else if (totalScore >= 3) {
            severity = "MODERATE";
        } else if (totalScore > 0) {
            severity = "MILD";
        } else {
            severity = "UNKNOWN";
        }

        return new SeverityResult(severity, totalScore, matched);
    }
}