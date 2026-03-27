package com.service;

import java.util.List;

import com.entity.Fees;
import com.repository.FeesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
public class FeesService {

    private final FeesRepository feesRepository;

    public FeesService(FeesRepository feesRepository) {
        this.feesRepository = feesRepository;
    }

    // ===== CREATE MONTHLY FEE RECORD =====
  public Fees createMonthlyFee(Integer studentId, Double amount) {
        Fees fees = new Fees();
        fees.setStudent(studentId);
        fees.setAmount(amount);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String today = LocalDate.now().format(formatter);
        fees.setDueDate(today);

        fees.setPaidDate(null);
        fees.setStatus("PENDING");

        return feesRepository.save(fees);
    }

    public Double getCollectionPercent() {
    try {
        Double paid = feesRepository.getPaidFees();
        Double total = feesRepository.getTotalFees();

        // Handle null or zero values
        if (paid == null || total == null || total == 0) {
            return 0.0;
        }

        double percent = (paid / total) * 100;
        return Math.round(percent * 100.0) / 100.0; // round to 2 decimal places

        } catch (Exception e) {
            // Log the exception and return 0 to keep the app stable
            System.err.println("Error calculating collection percent: " + e.getMessage());
            return 0.0;
        }
    }
    public Double getPendingFees() {
        return feesRepository.getPendingFees();
    }
    public Double getPaidFees() {
        return feesRepository.getPaidFees();
    }
    public Double getTotalFees() {
        return feesRepository.getTotalFees();
    }
    public Long countPendingFees() {
        return feesRepository.countPendingFees();
    }
    public Long countPaidFees() {
        return feesRepository.countPaidFees();
    }
    public Long countTotalFees() {
        return feesRepository.countTotalFees();
    }
    public Double getPaidCountPercent(){
            Long paidCount = feesRepository.countPaidFees();
            Long totalCount = feesRepository.countTotalFees();

            // Handle null or zero values
            if (paidCount == null || totalCount == null || totalCount == 0) {
                return 0.0;
            }
            double percent = ((double) paidCount / totalCount) * 100;
            return Math.round(percent * 100.0) / 100.0; // round to 2 decimal places
    }
    public Double getPendingCountPercent(){
            Long pendingCount = feesRepository.countPendingFees();
            Long totalCount = feesRepository.countTotalFees();

            // Handle null or zero values
            if (pendingCount == null || totalCount == null || totalCount == 0) {
                return 0.0;
            }
            double percent = ((double) pendingCount / totalCount) * 100;
            return Math.round(percent * 100.0) / 100.0; // round to 2 decimal places
    }
    public List<Object[]> getFeeInfo() {
        return feesRepository.getFeeInfo();
    }

}