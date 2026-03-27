package com.controller;

import com.service.RoomsService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; 



@CrossOrigin(origins = "*")

@RestController
@RequestMapping("api/rooms")

public class RoomsController {
    private final RoomsService roomsService;

    public RoomsController(RoomsService roomsService) {
        this.roomsService = roomsService;
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableRooms() {
        try {
            return ResponseEntity.ok(roomsService.findAvailableRooms());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving available rooms: " + e.getMessage());
        }
    }
    @PostMapping("/updateRoomLogin")
    public ResponseEntity<?> updateRoomLogin(@RequestBody Map<String, Integer> body) {
        Integer roomId = body.get("roomId");
        int updateCount = roomsService.updateRoomLogin(roomId);
        if (updateCount > 0) {
            return ResponseEntity.ok("Room login updated successfully.");
        } else {
            return ResponseEntity.status(500).body("Failed to update room login.");
        }
    }


    
}
