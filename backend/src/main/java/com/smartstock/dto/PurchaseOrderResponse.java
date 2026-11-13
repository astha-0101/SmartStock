package com.smartstock.dto;

import com.smartstock.model.PurchaseOrder;
import com.smartstock.model.PurchaseStatus;

import java.time.LocalDate;
import java.util.List;

public record PurchaseOrderResponse(
        Long orderId,
        Long supplierId,
        String supplierName,
        LocalDate orderDate,
        PurchaseStatus status,
        List<Item> items) {

    public record Item(Long productId, String productName, int quantity) {
    }

    public static PurchaseOrderResponse from(PurchaseOrder po) {
        List<Item> items = po.getItems().stream()
                .map(i -> new Item(i.getProduct().getProductId(), i.getProduct().getProductName(), i.getQuantity()))
                .toList();
        return new PurchaseOrderResponse(po.getOrderId(), po.getSupplier().getSupplierId(),
                po.getSupplier().getName(), po.getOrderDate(), po.getStatus(), items);
    }
}
