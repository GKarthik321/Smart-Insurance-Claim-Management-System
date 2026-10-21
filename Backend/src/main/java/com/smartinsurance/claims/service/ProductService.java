package com.smartinsurance.claims.service;

import com.smartinsurance.claims.dto.request.ProductRequest;
import com.smartinsurance.claims.dto.response.ProductResponse;
import com.smartinsurance.claims.entity.Product;
import com.smartinsurance.claims.entity.ProductCategory;
import com.smartinsurance.claims.exception.ResourceNotFoundException;
import com.smartinsurance.claims.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAll() {
        return productRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getByCategory(ProductCategory category) {
        return productRepository.findByProductCategory(category).stream().map(this::toResponse).toList();
    }

    public ProductResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .productName(request.productName())
                .productCategory(request.productCategory())
                .coverageAmount(request.coverageAmount())
                .premiumAmount(request.premiumAmount())
                .policyTenureMonths(request.policyTenureMonths())
                .description(request.description())
                .active(true)
                .build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findEntity(id);
        product.setProductName(request.productName());
        product.setProductCategory(request.productCategory());
        product.setCoverageAmount(request.coverageAmount());
        product.setPremiumAmount(request.premiumAmount());
        product.setPolicyTenureMonths(request.policyTenureMonths());
        product.setDescription(request.description());
        return toResponse(product);
    }

    @Transactional
    public void deactivate(Long id) {
        Product product = findEntity(id);
        product.setActive(false);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getProductName(), p.getProductCategory().name(),
                p.getCoverageAmount(), p.getPremiumAmount(), p.getPolicyTenureMonths(), p.getDescription(), p.isActive());
    }
}
