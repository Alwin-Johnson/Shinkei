package com.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.entity.Complaints;

@Repository
public interface ComplaintsRepository extends JpaRepository<Complaints, Integer> {

    // ===== INSERT OPERATION =====
    @Modifying
    @Query(value = """
        INSERT INTO Complaints (student_id, category, description, status, created_at, resolved_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        """, nativeQuery = true)
    int insertComplaint(Integer studentId, String category, String description,
                        String status, LocalDateTime createdAt, LocalDateTime resolvedAt);

    // ===== SELECT OPERATIONS =====
    @Query(value = "SELECT * FROM Complaints WHERE complaint_id = ?1", nativeQuery = true)
    Optional<Complaints> findByComplaintId(Integer complaintId);

    @Query(value = "SELECT * FROM Complaints WHERE student_id = ?1", nativeQuery = true)
    List<Complaints> findByStudentId(Integer studentId);

    @Query(value = "SELECT * FROM Complaints", nativeQuery = true)
    List<Complaints> findAllComplaints();

    @Query(value = "SELECT COUNT(*) FROM Complaints", nativeQuery = true)
    Long countAllComplaints();

    @Query(value = "SELECT COUNT(*) FROM Complaints WHERE status = 'pending'", nativeQuery = true)
    Long countPendingComplaints();

    @Query(value = "SELECT COUNT(*) FROM Complaints WHERE status = 'in_progress'", nativeQuery = true)
    Long countInProgressComplaints();

    @Query(value = "SELECT COUNT(*) FROM Complaints WHERE status = 'resolved'", nativeQuery = true)
    Long countResolvedComplaints();

    // ===== UPDATE OPERATIONS =====
    @Modifying
    @Query(value = "UPDATE Complaints SET status = ?2, resolved_at = ?3 WHERE complaint_id = ?1", nativeQuery = true)
    int updateStatus(Integer complaintId, String status, LocalDateTime resolvedAt);

    @Modifying
    @Query(value = "UPDATE Complaints SET description = ?2 WHERE complaint_id = ?1", nativeQuery = true)
    int updateDescription(Integer complaintId, String description);

    @Modifying
    @Query(value = "UPDATE Complaints SET category = ?2 WHERE complaint_id = ?1", nativeQuery = true)
    int updateCategory(Integer complaintId, String category);

    @Modifying
    @Query(value = "UPDATE Complaints SET category = ?2, description = ?3 WHERE complaint_id = ?1", nativeQuery = true)
    int updateComplaintDetails(Integer complaintId, String category, String description);

    // ===== DELETE OPERATIONS =====
    @Modifying
    @Query(value = "DELETE FROM Complaints WHERE complaint_id = ?1", nativeQuery = true)
    int deleteByComplaintId(Integer complaintId);

    @Modifying
    @Query(value = "DELETE FROM Complaints WHERE student_id = ?1", nativeQuery = true)
    int deleteByStudentId(Integer studentId);
}
