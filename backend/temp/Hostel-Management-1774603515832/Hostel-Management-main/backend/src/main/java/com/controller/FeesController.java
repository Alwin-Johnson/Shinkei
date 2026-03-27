package com.controller;

import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.service.FeesService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "*") // Add this line
@RestController
@RequestMapping("api/fees")
public class FeesController {
    private final FeesService feesService;
    public FeesController(FeesService feesService) {
        this.feesService = feesService;
    }

    @GetMapping("/admin/collection-percent")
    public Double getCollectionPercent() {
        return feesService.getCollectionPercent();    
    }

    @GetMapping("admin/pending-fees")
    public Double getPendingFees() {
        return feesService.getPendingFees();
    }

    @GetMapping("admin/fees/paid-fees")
    public Double getPaidFees() {
        return feesService.getPaidFees();
    }

    @GetMapping("admin/fees/table")
    public List<Object[]> getFeeInfo() {
        return feesService.getFeeInfo();
    }

    @GetMapping("admin/fees/pending-count")
    public Long countPendingFees() {
        return feesService.countPendingFees();
    }    

    @GetMapping("admin/fees/graph/paid-count-percent")
    public Double getPaidCountPercent() {
        return feesService.getPaidCountPercent();
    }

    @GetMapping("admin/fees/graph/pending-count-percent")
    public Double getPendingCountPercent() {
        return feesService.getPendingCountPercent();
    }

}