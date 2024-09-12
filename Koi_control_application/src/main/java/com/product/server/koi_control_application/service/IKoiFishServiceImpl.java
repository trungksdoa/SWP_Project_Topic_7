package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.dto.KoiFishCreationRequest;
import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IKoiFishServiceImpl implements IKoiFishService{
    private final KoiFishRepository koiFishRepository;
    @Override
    public KoiFish addKoiFish(KoiFishCreationRequest request) {
        KoiFish koiFish = new KoiFish();
        if(koiFishRepository.existsByName(request.getName()))
            throw new RuntimeException("KoiFish name existed.");



        return koiFishRepository.save(koiFish);
    }

    @Override
    public KoiFish getKoiFish(int id) {
        return koiFishRepository.findById(id).orElseThrow(() -> new RuntimeException("KoiFish not found"));
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }

    @Override
    public void deleteKoiFish(int id) {
        KoiFish koiFish = getKoiFish(id);
        koiFishRepository.delete(koiFish);
    }

    @Override
    public KoiFish updateKoiFish(int id, KoiFishUpdateRequest request) {
        KoiFish koiFish = getKoiFish(id);



        return koiFishRepository.save(koiFish);
    }
}
