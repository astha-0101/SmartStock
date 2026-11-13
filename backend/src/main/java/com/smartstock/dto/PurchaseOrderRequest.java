package com.smartstock.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record PurchaseOrderRequest(
        @NotNull(message = "Supplier is required") Long supplierId,
        @NotNull(message = "Order date is required") LocalDate orderDate,
        @NotEmpty(message = "At least one item is required") @Valid List<Item> items) {

    public record Item(
            @NotNull(message = "Product is required") Long productId,
            @Min(value = 1, message = "Quantity must be at least 1") int quantity) {
    }
}
