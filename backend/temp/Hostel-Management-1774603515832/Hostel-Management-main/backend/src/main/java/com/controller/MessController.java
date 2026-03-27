package com.controller;

import java.util.List;
import com.service.MessService;
import org.springframework.http.ResponseEntity;
import java.util.Map;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@CrossOrigin(origins = "*") // Add this line
@RestController

@RequestMapping("api/mess")
public class MessController {
    private final MessService messService;
    public MessController(MessService messService) {
        this.messService = messService;
    }

@GetMapping("/skipped-students")
public List<Object[]> getSkippedStudentsByDate() {
    return messService.getSkippedStudentsByDate();
}


    @GetMapping("/countSkipped/Breakfast")
    public Integer countSkippedBreakfast() {
        return messService.countSkippedBreakfast();
    }
    
    @GetMapping("/countSkipped/Lunch")
    public Integer countSkippedLunch() {
        return messService.countSkippedLunch();
    }

    @GetMapping("/countSkipped/Dinner")
    public Integer countSkippedDinner() {
        return messService.countSkippedDinner();
    }

  @PostMapping("/updateskipped")
    public ResponseEntity<?> updateSkippedByStudentId(@RequestBody Map<String, Object> request) {
        try {
            Boolean skipped = (Boolean) request.get("skipped");
            Integer studentId = (Integer) request.get("studentId");
            String mealType = (String) request.get("mealType");

            int updateCount = messService.updateSkippedByStudentId(skipped, studentId,mealType);

            if (updateCount > 0) {
                return ResponseEntity.ok("Skipped status updated successfully.");
            } else {
                return ResponseEntity.status(500).body("Failed to update skipped status.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Invalid request data: " + e.getMessage());
        }
    }
    
    
}
