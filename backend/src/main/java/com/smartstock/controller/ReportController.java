package com.smartstock.controller;

import com.smartstock.dto.AlertResponse;
import com.smartstock.dto.ReportSummary;
import com.smartstock.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports/summary")
    public ReportSummary summary() {
        return reportService.getSummary();
    }

    @GetMapping("/notifications")
    public List<AlertResponse> notifications() {
        return reportService.getAlerts();
    }
}
