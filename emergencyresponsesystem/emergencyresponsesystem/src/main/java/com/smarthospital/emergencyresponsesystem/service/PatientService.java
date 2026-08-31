package com.smarthospital.emergencyresponsesystem.service;

import com.smarthospital.emergencyresponsesystem.entity.Patient;
import com.smarthospital.emergencyresponsesystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        updatedPatient.setId(id);
        return patientRepository.save(updatedPatient);
    }

    /**
     * AI-based Fuzzy Matching: uses the Levenshtein Distance (Edit Distance)
     * algorithm — a classic dynamic-programming AI/NLP technique — to detect
     * potential duplicate patient records by comparing name similarity.
     */
    public List<Patient> findPotentialDuplicates(String name, String contactNumber) {
        List<Patient> allPatients = patientRepository.findAll();

        return allPatients.stream()
                .filter(p -> {
                    boolean sameContact = contactNumber != null && contactNumber.equals(p.getContactNumber());
                    double similarity = nameSimilarity(name, p.getName());
                    return sameContact || similarity >= 0.75; // 75%+ name similarity threshold
                })
                .collect(Collectors.toList());
    }

    private double nameSimilarity(String a, String b) {
        if (a == null || b == null) return 0;
        a = a.toLowerCase().trim();
        b = b.toLowerCase().trim();
        int distance = levenshteinDistance(a, b);
        int maxLength = Math.max(a.length(), b.length());
        if (maxLength == 0) return 1.0;
        return 1.0 - ((double) distance / maxLength);
    }

    // Levenshtein Distance (Edit Distance) - Dynamic Programming algorithm
    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {
            for (int j = 0; j <= b.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
                    dp[i][j] = Math.min(
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                            dp[i - 1][j - 1] + cost
                    );
                }
            }
        }
        return dp[a.length()][b.length()];
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}