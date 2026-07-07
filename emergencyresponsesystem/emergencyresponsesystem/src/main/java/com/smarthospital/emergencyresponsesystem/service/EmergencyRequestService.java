package com.smarthospital.emergencyresponsesystem.service;

import com.smarthospital.emergencyresponsesystem.entity.EmergencyRequest;
import com.smarthospital.emergencyresponsesystem.repository.EmergencyRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmergencyRequestService {

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    public EmergencyRequest createRequest(EmergencyRequest request) {
        request.setStatus("REQUESTED");
        request.setRequestTime(LocalDateTime.now());
        return emergencyRequestRepository.save(request);
    }

    public List<EmergencyRequest> getAllRequests() {
        return emergencyRequestRepository.findAll();
    }

    public Optional<EmergencyRequest> getRequestById(Long id) {
        return emergencyRequestRepository.findById(id);
    }

    public EmergencyRequest updateRequest(Long id, EmergencyRequest updatedRequest) {
        updatedRequest.setId(id);
        return emergencyRequestRepository.save(updatedRequest);
    }

    public void deleteRequest(Long id) {
        emergencyRequestRepository.deleteById(id);
    }
}