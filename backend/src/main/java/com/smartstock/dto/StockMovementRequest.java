package com.smartstock.dto;

import com.smartstock.model.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StockMovementRequest(
        @NotNull(message = "Product is required") Long productId,
        @NotNull(message = "Type is required") MovementType type,
        @Min(value = 0, message = "Quantity cannot be negative") int quantity,
        @NotBlank(message = "Reason is required") @Size(max = 255) String reason) {
}
