package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.PondCreationRequest;
import com.product.server.koi_control_application.dto.PondUpdateRequest;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.repository.PondRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class IPondServiceImpl implements  IPondService {
    private final PondRepository pondRepository;
    private final IWaterParameterService iWaterParameterService;

    @Override
    public Pond addPond(PondCreationRequest request) {
        Pond pond = new Pond();


        return pondRepository.save(pond);
    }

    @Override
    public Pond getPond(int id) {
        return pondRepository.findById(id).orElseThrow(() -> new RuntimeException("Pond not found"));
    }

    @Override
    public Page<Pond> getPonds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return pondRepository.findAll(pageable);
    }

    @Override
    public void deletePond(int id) {
        Pond pond = getPond(id);
        pondRepository.delete(pond);
    }

    @Override
    public Pond updatePond(int id, PondUpdateRequest request) {
        Pond pond = getPond(id);


        return pondRepository.save(pond);
    }

    @Override
    public void updateWaterParameter(int id) {

        iWaterParameterService.createWaterParameter(id);
    }
}


