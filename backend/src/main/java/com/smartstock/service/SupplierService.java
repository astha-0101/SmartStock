package com.smartstock.service;

import com.smartstock.dto.SupplierRequest;
import com.smartstock.exception.ConflictException;
import com.smartstock.exception.ResourceNotFoundException;
import com.smartstock.model.Supplier;
import com.smartstock.repository.PurchaseOrderRepository;
import com.smartstock.repository.SupplierRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public SupplierService(SupplierRepository supplierRepository, PurchaseOrderRepository purchaseOrderRepository) {
        this.supplierRepository = supplierRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll(Sort.by("supplierId"));
    }

    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    @Transactional
    public Supplier create(SupplierRequest request) {
        Supplier supplier = new Supplier();
        apply(supplier, request);
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier update(Long id, SupplierRequest request) {
        Supplier supplier = getById(id);
        apply(supplier, request);
        return supplierRepository.save(supplier);
    }

    @Transactional
    public void delete(Long id) {
        Supplier supplier = getById(id);
        if (purchaseOrderRepository.existsBySupplierSupplierId(id)) {
            throw new ConflictException("This supplier has purchase orders and cannot be deleted.");
        }
        supplierRepository.delete(supplier);
    }

    private void apply(Supplier supplier, SupplierRequest request) {
        supplier.setName(request.name().trim());
        supplier.setEmail(request.email().trim());
        supplier.setPhone(request.phone().trim());
        supplier.setAddress(request.address() == null ? null : request.address().trim());
    }
}
