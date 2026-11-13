package com.smartstock.dto;

import com.smartstock.model.PurchaseStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull(message = "Status is required") PurchaseStatus status) {
}
