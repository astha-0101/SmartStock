package com.smartstock.dto;

import com.smartstock.model.Product;

import java.util.List;

public record ReportSummary(
        double totalInventoryValue,
        int totalProducts,
        long totalUnits,
        List<CategoryStat> categories,
        List<Product> lowStock,
        List<Product> outOfStock,
        List<MonthlyMovement> monthlyMovement) {

    public record CategoryStat(String category, long productCount, long totalUnits) {
    }

    public record MonthlyMovement(String month, long additions, long reductions, long adjustments) {
    }
}
