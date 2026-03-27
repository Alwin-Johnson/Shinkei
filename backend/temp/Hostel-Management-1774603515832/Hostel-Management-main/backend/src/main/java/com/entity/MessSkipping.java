package com.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="MessSkipping")
public class MessSkipping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="skip_id")
    private Integer skipId;

    @Column(name="student_id", nullable=false)
    private Integer studentId;

    @Column(name="date", nullable=false)
    private LocalDate date;

    
    @Column(name="meal_type", nullable=false, length=10)
    private String meal_type;

    @Column(name="skipped", nullable=false)
    private Boolean skipped;

    

    public MessSkipping() {}

    public MessSkipping(Integer studentId, LocalDate date, String meal_type, Boolean skipped) {
        this.studentId = studentId;
        this.date = date;
        this.meal_type = meal_type;
        this.skipped = skipped;
    }

    public Integer getSkipId() {
        return skipId;
    }

    public void setSkipId(Integer skipId) {
        this.skipId = skipId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMealType() {
        return meal_type;
    }

    public void setMealType(String mealType) {
        this.meal_type = mealType;
    }

    public Boolean getSkipped() {
        return skipped;
    }

    public void setSkipped(Boolean skipped) {
        this.skipped = skipped;
    }
}
