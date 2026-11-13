package com.smartstock.service;

import com.smartstock.dto.AlertResponse;
import com.smartstock.dto.ReportSummary;
import com.smartstock.model.MovementType;
import com.smartstock.model.Product;
import com.smartstock.model.StockTransaction;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

/** Reports and alerts, computed from live database rows on every request. */
@Service
public class ReportService {

    private static final int LOW_STOCK_THRESHOLD = 10;
    private static final int TREND_MONTHS = 6;

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;

    public ReportService(ProductRepository productRepository, StockTransactionRepository transactionRepository) {
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public ReportSummary getSummary() {
        List<Product> products = productRepository.findAll();

        double value = 0;
        long units = 0;
        Map<String, long[]> byCategory = new TreeMap<>();
        List<Product> low = new ArrayList<>();
        List<Product> out = new ArrayList<>();
        for (Product p : products) {
            value += p.getQuantity() * p.getPrice();
            units += p.getQuantity();
            String category = (p.getCategory() == null || p.getCategory().isBlank()) ? "Uncategorized" : p.getCategory();
            long[] stat = byCategory.computeIfAbsent(category, k -> new long[2]);
            stat[0] += 1;
            stat[1] += p.getQuantity();
            if (p.getQuantity() == 0) {
                out.add(p);
            } else if (p.getQuantity() <= LOW_STOCK_THRESHOLD) {
                low.add(p);
            }
        }
        List<ReportSummary.CategoryStat> categories = new ArrayList<>();
        byCategory.forEach((name, stat) -> categories.add(new ReportSummary.CategoryStat(name, stat[0], stat[1])));

        return new ReportSummary(value, products.size(), units, categories, low, out, monthlyMovement());
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAlerts() {
        List<AlertResponse> alerts = new ArrayList<>();
        for (Product p : productRepository.findByQuantityLessThanEqual(LOW_STOCK_THRESHOLD)) {
            if (p.getQuantity() == 0) {
                alerts.add(new AlertResponse("OUT_OF_STOCK", p.getProductId(), p.getProductName(), 0,
                        p.getProductName() + " is out of stock"));
            } else {
                alerts.add(new AlertResponse("LOW_STOCK", p.getProductId(), p.getProductName(), p.getQuantity(),
                        p.getProductName() + " is low on stock (" + p.getQuantity() + " left)"));
            }
        }
        alerts.sort(Comparator.comparingInt(AlertResponse::quantity));
        return alerts;
    }

    private List<ReportSummary.MonthlyMovement> monthlyMovement() {
        YearMonth first = YearMonth.now().minusMonths(TREND_MONTHS - 1);
        Map<YearMonth, long[]> months = new LinkedHashMap<>();
        for (int i = 0; i < TREND_MONTHS; i++) {
            months.put(first.plusMonths(i), new long[3]);
        }
        LocalDateTime since = first.atDay(1).atStartOfDay();
        for (StockTransaction t : transactionRepository.findByCreatedAtGreaterThanEqual(since)) {
            long[] bucket = months.get(YearMonth.from(t.getCreatedAt()));
            if (bucket == null) {
                continue;
            }
            if (t.getType() == MovementType.ADDITION) {
                bucket[0] += t.getQuantity();
            } else if (t.getType() == MovementType.REDUCTION) {
                bucket[1] += t.getQuantity();
            } else {
                bucket[2] += Math.abs(t.getNewQuantity() - t.getPreviousQuantity());
            }
        }
        List<ReportSummary.MonthlyMovement> result = new ArrayList<>();
        months.forEach((month, b) -> result.add(new ReportSummary.MonthlyMovement(month.toString(), b[0], b[1], b[2])));
        return result;
    }
}
