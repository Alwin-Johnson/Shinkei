package com.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import com.repository.MessSkippingRepository;
import java.time.LocalDate;



@Service
@Transactional

public class MessService {
    private final  MessSkippingRepository messSkippingRespository;
    public MessService( MessSkippingRepository messSkippingRespository) {
        this.messSkippingRespository = messSkippingRespository;
    }

    public List<Object[]> getSkippedStudentsByDate(){
        LocalDate date = LocalDate.of(2025, 10, 15);
        return messSkippingRespository.getSkippedStudentsByDate(date);
    }


    public Integer countSkippedByDateAndMealType(String date, String mealType) {
        switch (mealType) {
            case "Breakfast":
                return messSkippingRespository.countSkippedBreakfast();
            case "Lunch":
                return messSkippingRespository.countSkippedLunch();
            case "Dinner":
                return messSkippingRespository.countSkippedDinner();
            default:
                throw new IllegalArgumentException("Invalid meal type: " + mealType);
        }


    }
    public Integer countSkippedBreakfast() {
        return messSkippingRespository.countSkippedBreakfast();
    }
    public Integer countSkippedLunch() {
        return messSkippingRespository.countSkippedLunch();
    }

    public Integer countSkippedDinner() {
        return messSkippingRespository.countSkippedDinner();
    }

    public int updateSkippedByStudentId(Boolean skipped, Integer studentId,String mealType) {
       
        return messSkippingRespository.updateSkippedByStudentId(skipped, studentId,mealType);
    }
}

    

