package com.smartstock.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierRequest(
        @NotBlank(message = "Supplier name is required") @Size(max = 150) String name,
        @NotBlank(message = "Email is required") @Email(message = "Email is not valid") @Size(max = 150) String email,
        @NotBlank(message = "Phone is required") @Size(max = 30) String phone,
        @Size(max = 255) String address) {
}
