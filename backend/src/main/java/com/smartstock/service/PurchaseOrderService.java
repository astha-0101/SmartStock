package com.smartstock.service;

import com.smartstock.dto.PurchaseOrderRequest;
import com.smartstock.dto.PurchaseOrderResponse;
import com.smartstock.exception.ConflictException;
import com.smartstock.exception.ResourceNotFoundException;
import com.smartstock.model.*;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.PurchaseOrderRepository;
import com.smartstock.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final StockService stockService;

    public PurchaseOrderService(PurchaseOrderRepository orderRepository, SupplierRepository supplierRepository,
                                ProductRepository productRepository, StockService stockService) {
        this.orderRepository = orderRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.stockService = stockService;
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAll() {
        return orderRepository.findAllByOrderByOrderIdDesc().stream().map(PurchaseOrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(Long id) {
        return PurchaseOrderResponse.from(find(id));
    }

    @Transactional
    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + request.supplierId()));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setOrderDate(request.orderDate());
        order.setStatus(PurchaseStatus.PENDING);

        Set<Long> seen = new HashSet<>();
        for (PurchaseOrderRequest.Item item : request.items()) {
            if (!seen.add(item.productId())) {
                throw new IllegalArgumentException("Each product can appear only once in an order.");
            }
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.productId()));
            PurchaseOrderItem orderItem = new PurchaseOrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.quantity());
            order.getItems().add(orderItem);
        }
        return PurchaseOrderResponse.from(orderRepository.save(order));
    }

    /**
     * Allowed: PENDING -> APPROVED | CANCELLED, APPROVED -> RECEIVED | CANCELLED.
     * Moving to RECEIVED adds every item's quantity to product stock (and writes
     * stock history) in the same transaction, so it either fully happens or not at all.
     */
    @Transactional
    public PurchaseOrderResponse updateStatus(Long id, PurchaseStatus newStatus) {
        PurchaseOrder order = find(id);
        PurchaseStatus current = order.getStatus();

        boolean allowed = (current == PurchaseStatus.PENDING
                && (newStatus == PurchaseStatus.APPROVED || newStatus == PurchaseStatus.CANCELLED))
                || (current == PurchaseStatus.APPROVED
                && (newStatus == PurchaseStatus.RECEIVED || newStatus == PurchaseStatus.CANCELLED));
        if (!allowed) {
            throw new ConflictException("Cannot change status from " + current + " to " + newStatus + ".");
        }

        if (newStatus == PurchaseStatus.RECEIVED) {
            for (PurchaseOrderItem item : order.getItems()) {
                stockService.recordMovement(item.getProduct().getProductId(), MovementType.ADDITION,
                        item.getQuantity(), "Purchase order #" + id + " received");
            }
        }
        order.setStatus(newStatus);
        return PurchaseOrderResponse.from(order);
    }

    private PurchaseOrder find(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found: " + id));
    }
}
