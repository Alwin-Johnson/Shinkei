

    
package com.controller;

import com.entity.Student;
import com.service.StudentService;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;



import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@CrossOrigin(origins = "*") // Add this line
@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    private final StudentService studentService;
    
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    //REGISTER ENDPOINT (POST)
    //register student form
    @PostMapping("/register/form")
public ResponseEntity<?> registerStudent(@RequestBody Map<String, String> params) {
    
    System.out.println("Received parameters: " + params);
    
    try {
        String collegeId = params.get("collegeId");
        String name = params.get("name");
        String gender = params.get("gender");
        String course = params.get("course");
        String stream = params.get("stream");
        String year = params.get("year");
        String email = params.get("email");
        String dobStr = params.get("dob"); // String value from map
        LocalDate dob = LocalDate.parse(dobStr); 
        String address = params.get("address");
        String parentName = params.get("parentName");
        String parentContact = params.get("parentContact");
        String contactNo = params.get("contactNo");
        String guardianName = params.get("guardianName");
        String guardianContact = params.get("guardianContact");
        
        System.out.println("Calling studentService.registerStudent with parameters:");
        System.out.println("Email: " + email);
        
        if (studentService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        
        Student student = studentService.registerStudent(
            collegeId, name, gender, dob, course, stream, year,
            email, contactNo, address, guardianName, guardianContact, parentName, parentContact
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(student);
            
    } catch (Exception e) {
        System.out.println("Full exception:");
        e.printStackTrace();
        return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
    }
}

@PostMapping("/register/passwordsetting")
public ResponseEntity<?> setPassword(@RequestBody Map<String, String> params) {   
    try {
        Integer studentId = Integer.parseInt(params.get("studentId"));
        String password = params.get("password");
        
        System.out.println("Setting password for student ID: " + studentId);
        
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }

        studentService.changePassword(studentId, password);
        
        return ResponseEntity.ok("Password updated successfully");
        
    } catch (NumberFormatException e) {
        return ResponseEntity.badRequest().body("Invalid student ID format");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Failed to update password: " + e.getMessage());
    }
}

@PostMapping("/register/admissionfee")
public ResponseEntity<?> updateAdmissionFee(@RequestBody Map<String, String> params) {   
    try {
        Integer studentId = Integer.parseInt(params.get("studentId"));
       
        int updated = studentService.updateAdmissionFee(true, studentId);  // ✅ Hardcoded TRUE is correct
        if (updated <= 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update admission fee status");
        }       
        
        return ResponseEntity.ok("Admission fee updated successfully");
        
    } catch (NumberFormatException e) {
        return ResponseEntity.badRequest().body("Invalid student ID format");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Failed to update admission fee: " + e.getMessage());
    }
}

@PostMapping("/register/roomid")
public ResponseEntity<?> updateRoomId(@RequestBody Map<String, String> params) {   
    try {
        Integer studentId = Integer.parseInt(params.get("studentId"));
        Integer roomId = Integer.parseInt(params.get("roomId"));
       
        int updated = studentService.assignRoom(roomId, studentId);
        if (updated <= 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to assign room");
        }       
        
        return ResponseEntity.ok("Room ID updated successfully");
        
    } catch (NumberFormatException e) {
        return ResponseEntity.badRequest().body("Invalid student ID or room ID format");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Failed to update room ID: " + e.getMessage());
    }
}




    // ===== LOGIN ENDPOINT (GET) =====
    @GetMapping("/login")
    public ResponseEntity<?> loginStudent(@RequestParam String email, 
                                        @RequestParam String password) {
        try {
            Student student = studentService.login(email, password);
            return ResponseEntity.ok(student);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    // Dashboard
    @GetMapping("Admin/dashboard/student-count")
    public ResponseEntity<Long> getStudentCount() {
        Long count = studentService.countAllStudents();
        return ResponseEntity.ok(count);
    }

    @GetMapping("Admin/student/table")
public ResponseEntity<?> getStudentRoomFeeInfo() {
    try {
        List<Object[]> rawData = studentService.findStudentRoomFeeInfo();

        
        List<Map<String, Object>> mappedList = rawData.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("studentId", row[1]);
            map.put("roomNo", row[2]);
            map.put("admissionDate", row[3]);
            map.put("fee", row[4]);
            map.put("feeStatus", row[5]);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(mappedList);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to retrieve data: " + e.getMessage());
    }
}
@GetMapping("/Admin/studentProfile/personalAndRoomData")
public ResponseEntity<?> getPersonalAndRoomData(@RequestParam Integer studentId) {
    try {
        if (studentId == null || studentId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid student ID. Must be a positive integer.");
        }
        
        Object[] student = studentService.getPersonalDataByStudentById(studentId);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Student not found with ID: " + studentId);
        }
        return ResponseEntity.ok(student);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to retrieve data: " + e.getMessage());
    }
}
@GetMapping("/Admin/studentProfile/roommates")
public ResponseEntity<List<String>> getRoommates(@RequestParam Integer studentId) {
    System.out.println("=== CONTROLLER: Received request for studentId: " + studentId);
    try {
        if (studentId == null || studentId <= 0) {
            System.out.println("=== Invalid studentId");
            return ResponseEntity.badRequest().build();
        }
        
        List<String> roommates = studentService.findRoommatesByStudentId(studentId);
        System.out.println("=== CONTROLLER: Roommates found: " + roommates);
        
        if (roommates == null) {
            roommates = new ArrayList<>();
        }
        
        return ResponseEntity.ok(roommates);
    } catch (Exception e) {
        System.out.println("=== ERROR: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}




