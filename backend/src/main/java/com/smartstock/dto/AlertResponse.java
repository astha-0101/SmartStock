package com.smartstock.dto;

public record AlertResponse(String type, Long productId, String productName, int quantity, String message) {
}
