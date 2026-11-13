package com.smartstock.dto;

import com.smartstock.model.MovementType;
import com.smartstock.model.StockTransaction;

import java.time.LocalDateTime;

public record StockMovementResponse(
        Long transactionId,
        Long productId,
        String productName,
        MovementType type,
        int quantity,
        int previousQuantity,
        int newQuantity,
        String reason,
        LocalDateTime createdAt) {

    public static StockMovementResponse from(StockTransaction t) {
        return new StockMovementResponse(t.getTransactionId(), t.getProduct().getProductId(),
                t.getProduct().getProductName(), t.getType(), t.getQuantity(), t.getPreviousQuantity(),
                t.getNewQuantity(), t.getReason(), t.getCreatedAt());
    }
}
