package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.entity.EmergencyRequest;
import com.smarthospital.emergencyresponsesystem.service.EmergencyRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-requests")
@CrossOrigin(origins = "*")
public class EmergencyRequestController {

    @Autowired
    private EmergencyRequestService emergencyRequestService;

    @PostMapping
    public EmergencyRequest createRequest(@RequestBody EmergencyRequest request) {
        return emergencyRequestService.createRequest(request);
    }

    @GetMapping
    public List<EmergencyRequest> getAllRequests() {
        return emergencyRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public EmergencyRequest getRequestById(@PathVariable Long id) {
        return emergencyRequestService.getRequestById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    @PutMapping("/{id}")
    public EmergencyRequest updateRequest(@PathVariable Long id, @RequestBody EmergencyRequest request) {
        return emergencyRequestService.updateRequest(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        emergencyRequestService.deleteRequest(id);
        return "Request deleted successfully with id: " + id;
    }
}