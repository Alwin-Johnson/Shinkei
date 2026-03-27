package com.entity;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "Complaints")
public class Complaints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complaint_id")
    private Integer complaintId;

    @Column(name="student_id", nullable=false)
    private Integer studentId;

    @Enumerated(EnumType.STRING)
    @Column(name="category", nullable=false)
    private Category category;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "status",length = 20,columnDefinition = "VARCHAR(20) DEFAULT'pending")
    private String status = "pending";
     
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "resolved_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = true)
    private LocalDateTime resolvedAt;

    public enum Category {ROOM,MESS,FACILITY,OTHER} 

public Complaints() {}

    public Complaints(Integer complaintId,Integer studentId, Category category,String description, String status, LocalDateTime createdAt,LocalDateTime resolvedAt) {
        this.complaintId = complaintId;
        this.studentId = studentId;
        this.category = category;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;

    }
     public Integer getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Integer complaintId) {
        this.complaintId = complaintId;
    }
    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
     public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status = status;
    }
    public LocalDateTime getCreatedAt() 
    { 
        return createdAt; 
    }
    public void setCreatedAt(LocalDateTime createdAt) 
    { 
        this.createdAt = createdAt; 
    }
    public LocalDateTime getResolvedAt() 
    { 
        return resolvedAt; 
    }
    public void setResolvedAt(LocalDateTime resolvedAt) 
    { 
        this.resolvedAt = resolvedAt; 
    }
}