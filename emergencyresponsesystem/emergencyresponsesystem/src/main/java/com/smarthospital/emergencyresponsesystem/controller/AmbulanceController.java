package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.entity.Ambulance;
import com.smarthospital.emergencyresponsesystem.service.AmbulanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@CrossOrigin(origins = "*")
public class AmbulanceController {

    @Autowired
    private AmbulanceService ambulanceService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public Ambulance addAmbulance(@RequestBody Ambulance ambulance) {
        return ambulanceService.addAmbulance(ambulance);
    }

    @GetMapping
    public List<Ambulance> getAllAmbulances() {
        return ambulanceService.getAllAmbulances();
    }

    @GetMapping("/{id}")
    public Ambulance getAmbulanceById(@PathVariable Long id) {
        return ambulanceService.getAmbulanceById(id)
                .orElseThrow(() -> new RuntimeException("Ambulance not found with id: " + id));
    }

    @PutMapping("/{id}")
    public Ambulance updateAmbulance(@PathVariable Long id, @RequestBody Ambulance ambulance) {
        Ambulance updated = ambulanceService.updateAmbulance(id, ambulance);
        messagingTemplate.convertAndSend("/topic/ambulance-updates", updated);
        return updated;
    }

    @DeleteMapping("/{id}")
    public String deleteAmbulance(@PathVariable Long id) {
        ambulanceService.deleteAmbulance(id);
        return "Ambulance deleted successfully with id: " + id;
    }

    @PostMapping("/auto-dispatch")
    public Ambulance autoDispatch(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) Long hospitalId) {
        Ambulance dispatched = ambulanceService.autoDispatch(latitude, longitude, hospitalId);
        if (dispatched != null) {
            messagingTemplate.convertAndSend("/topic/ambulance-updates", dispatched);
        }
        return dispatched;
    }
}