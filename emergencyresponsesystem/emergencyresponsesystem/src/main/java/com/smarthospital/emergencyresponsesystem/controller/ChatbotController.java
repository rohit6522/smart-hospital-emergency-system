package com.smarthospital.emergencyresponsesystem.controller;

import com.smarthospital.emergencyresponsesystem.dto.ChatRequest;
import com.smarthospital.emergencyresponsesystem.dto.ChatResponse;
import com.smarthospital.emergencyresponsesystem.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chatbot")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatbotService.getResponse(request.getMessage());
    }
}