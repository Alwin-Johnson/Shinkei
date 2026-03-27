package com.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    
    // ===== INSERT OPERATIONS =====
    @Modifying
    @Query(value = """
        INSERT INTO Student (college_id, name, gender, dob, admission_date, course, 
                           stream, year, email, contact_no, address, guardian_name, 
                           guardian_contact, parent_name, parent_contact, room_id, 
                           admission_fee, password, created_at) 
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)
        """, nativeQuery = true)
    int insertStudent(String collegeId, String name, String gender, LocalDate dob, 
                     LocalDate admissionDate, String course, String stream, String year,
                     String email, String contactNo, String address, String guardianName,
                     String guardianContact, String parentName, String parentContact,
                     Integer roomId, Boolean admissionFee, String password, LocalDateTime createdAt);
    
    // ===== SELECT OPERATIONS =====
    @Query(value = "SELECT * FROM Student WHERE email = ?1", nativeQuery = true)
    Optional<Student> findByEmail(String email);
    
    @Query(value = "SELECT * FROM Student WHERE student_id = ?1", nativeQuery = true)
    Optional<Student> findById(Integer studentId);
    
    @Query(value = "SELECT * FROM Student", nativeQuery = true)
    List<Student> findAllStudents();
    
    @Query(value = "SELECT COUNT(*) FROM Student", nativeQuery = true)
    Long countAllStudents();
    
    // FIXED: Use standard JPA method (no custom query needed)
    boolean existsByEmail(String email);
    

    @Query(value ="SELECT s.name AS Name, s.student_id AS studentId, r.room_no AS roomNo, s.admission_date AS admissionDate, f.amount AS fee, f.status AS feeStatus FROM student s LEFT JOIN rooms r ON s.room_id = r.room_id LEFT JOIN fees f ON s.student_id = f.student_id", nativeQuery = true)
    List<Object[]> findStudentRoomFeeInfo();



    @Query(value = "SELECT * FROM Student WHERE room_id = ?1", nativeQuery = true)
    List<Student> findStudentsByRoom(Integer roomId);
    

    @Query(value = "SELECT s.student_id, s.name, s.college_id, s.gender, s.dob, s.admission_date, s.email, s.contact_no, s.parent_name, s.parent_contact, s.guardian_name, s.guardian_contact, s.address, s.course, s.stream, s.year, r.room_no, r.floor,r.monthly_rent FROM Student s LEFT JOIN Rooms r ON s.room_id = r.room_id WHERE s.student_id = ?1", nativeQuery = true)
    Optional<Object[]> getPersonalDataByStudentById(Integer studentId);

@Query(value = "SELECT s2.name FROM Student s1 JOIN Student s2 ON s1.room_id = s2.room_id WHERE s1.student_id = ?1 AND s2.student_id != ?1 AND s1.room_id IS NOT NULL", nativeQuery = true)
List<String> findRoommatesByStudentId(Integer studentId);

    @Modifying
    @Query(value = "UPDATE Student SET admission_fee = ?1 WHERE student_id = ?2", nativeQuery = true)
    int updateAdmissionFee(Boolean admissionFee, Integer studentId);
    
    @Modifying
    @Query(value = "UPDATE Student SET room_id = ?1 WHERE student_id = ?2", nativeQuery = true)
    int assignRoom(Integer roomId, Integer studentId);
    
    @Modifying
    @Query(value = "UPDATE Student SET room_id = NULL WHERE student_id = ?1", nativeQuery = true)
    int removeFromRoom(Integer studentId);
    
    @Modifying
    @Query(value = "UPDATE Student SET password = ?1 WHERE student_id = ?2", nativeQuery = true)
    int changePassword(String newPassword, Integer studentId);
    
    // ===== DELETE OPERATIONS =====
    // @Modifying
    // @Query(value = "DELETE FROM Student WHERE student_id = ?1", nativeQuery = true)
    // int deleteStudentById(Integer studentId);
}
