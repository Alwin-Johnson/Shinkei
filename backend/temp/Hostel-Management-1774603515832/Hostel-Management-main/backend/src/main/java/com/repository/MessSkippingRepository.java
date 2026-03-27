package com.repository;

import com.entity.MessSkipping;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface MessSkippingRepository extends JpaRepository<MessSkipping, Long> {
    
    @Modifying
    @Query(value = """
        INSERT INTO MessSkipping (skip_id, student_id, date, meal_type, skipped) 
        VALUES (?1, ?2, ?3, ?4, ?5) 
        """, nativeQuery = true)
    int insertSkipRecord(Integer skipId, Integer studentId, String date, String mealType, Boolean skipped);

    @Modifying
    @Query(value = """ 
        UPDATE MessSkipping 
        SET student_id = ?2, date = ?3, meal_type = ?4, skipped = ?5
        WHERE skip_id = ?1 
        """, nativeQuery = true)
    int updateSkipRecord(Integer skipId, Integer studentId, String date, String mealType, Boolean skipped);

    @Query(value = "SELECT * FROM MessSkipping WHERE student_id = ?1 AND date = ?2 AND meal_type = ?3", nativeQuery = true)
    MessSkipping findByStudentDateMeal(Integer studentId, String date, String mealType);

    @Query(value = "SELECT * FROM MessSkipping WHERE student_id = ?1", nativeQuery = true)
    List<MessSkipping> findByStudentId(Integer studentId);

    @Query(value = "SELECT * FROM MessSkipping", nativeQuery = true)
    List<MessSkipping> findAllSkipRecords();

    @Query(value = "SELECT s.name, m.meal_type, r.floor, r.room_no,s.contact_no FROM student s, messskipping m, rooms r WHERE s.student_id = m.student_id AND s.room_id = r.room_id AND m.date = ?1 AND m.skipped IS NULL", nativeQuery = true)
List<Object[]> getSkippedStudentsByDate(@Param("date") LocalDate date);



   @Query(value = "select count(*) from messskipping where date = '2025-10-15' and meal_type = 'Breakfast'", nativeQuery = true)
Integer countSkippedBreakfast();

@Query(value = "select count(*) from messskipping where date = '2025-10-15' and meal_type = 'Dinner' and skipped IS NULL", nativeQuery = true)
Integer countSkippedDinner();

@Query(value = "select count(*) from messskipping where date = '2025-10-15' and meal_type = 'Lunch' and skipped IS NULL", nativeQuery = true)
Integer countSkippedLunch();

@Modifying
@Query(value = "UPDATE messskipping SET skipped = ?1 WHERE student_id = ?2 and meal_type= ?3", nativeQuery = true)
int updateSkippedByStudentId(Boolean skipped, Integer studentId,String mealType);


    
}
