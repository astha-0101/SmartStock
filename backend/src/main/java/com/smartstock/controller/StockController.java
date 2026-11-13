package com.smartstock.controller;

import com.smartstock.dto.StockMovementRequest;
import com.smartstock.dto.StockMovementResponse;
import com.smartstock.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<StockMovementResponse> getHistory() {
        return stockService.getHistory();
    }

    @PostMapping
    public ResponseEntity<StockMovementResponse> record(@Valid @RequestBody StockMovementRequest request) {
        StockMovementResponse saved = stockService.recordMovement(
                request.productId(), request.type(), request.quantity(), request.reason().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
