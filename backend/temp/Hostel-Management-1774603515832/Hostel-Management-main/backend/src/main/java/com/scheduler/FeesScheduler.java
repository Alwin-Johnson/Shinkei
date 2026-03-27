package com.scheduler;

import com.entity.Student;
import com.service.StudentService;
import com.service.FeesService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FeesScheduler {

    private final FeesService feesService;
    private final StudentService studentService;

    public FeesScheduler(FeesService feesService, StudentService studentService) {
        this.feesService = feesService;
        this.studentService = studentService;
    }

    /**
     * This job runs automatically at 00:00 on the 1st day of every month
     * and inserts fees for all students.
     */
    @Scheduled(cron = "0 0 0 1 * ?")
    public void generateMonthlyFees() {
        List<Student> students = studentService.getAllStudents(); 
        double monthlyFeeAmount = 2000.0;   //dummy valueeee change later

        for (Student student : students) {
            feesService.createMonthlyFee(student.getStudentId(), monthlyFeeAmount);
        }
    }
}
