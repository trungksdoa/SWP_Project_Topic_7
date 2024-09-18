package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IKoiFishService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IKoiFishServiceImpl implements IKoiFishService {
    private final UsersRepository usersRepository;
    private final KoiFishRepository koiFishRepository;
    private final PondRepository pondRepository;
    @Override
    public KoiFish addKoiFish(KoiFish koiFish) {
        if(!usersRepository.existsById(koiFish.getBreeder()))
            throw new RuntimeException("User not found.");

        if(!pondRepository.existsById(koiFish.getPondId()))
            throw new RuntimeException("Pond not found.");

        if(!pondRepository.existsByIdAndBreeder(koiFish.getPondId(), koiFish.getBreeder()))
            throw new RuntimeException("This Breeder dont have this Pond!.");

        if(koiFishRepository.existsByNameAndPondId(koiFish.getName(), koiFish.getPondId()))
            throw new RuntimeException("KoiFish name existed.");

        return koiFishRepository.save(koiFish);
    }

    @Override
    public KoiFish getKoiFish(int id) {
        return koiFishRepository.findById(id).orElseThrow(() -> new RuntimeException("KoiFish not found"));
    }

    @Override
    public Page<KoiFish> getKoiFishsByPondId(int pondId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAllByPondId(pondId, pageable);
    }

    @Override
    public void deleteKoiFish(int id) {

        koiFishRepository.deleteById(id);
    }

    @Override
    public KoiFish updateKoiFish(int id, KoiFishUpdateRequest request) {
        KoiFish koiFish = getKoiFish(id);

        if(!usersRepository.existsById(request.getBreeder()))
            throw new RuntimeException("User not found.");

        if(!pondRepository.existsByIdAndBreeder(request.getPondId(), request.getBreeder()))
            throw new RuntimeException("This Breeder dont have this Pond!.");

        if(koiFishRepository.existsByNameAndPondIdExceptId(request.getName(), request.getPondId(), id))
            throw new RuntimeException("KoiFish name existed.");


        koiFish.setName(request.getName());
        koiFish.setVariety(request.getVariety());
        koiFish.setSex(request.getSex());
        koiFish.setPurchasePrice(request.getPurchasePrice());
        koiFish.setBreeder(request.getBreeder());
        koiFish.setImageUrl(request.getImageUrl());
        koiFish.setPondId(request.getPondId());



        return koiFishRepository.save(koiFish);
    }

    @Override
    public Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAllByBreeder(userId,pageable);
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }
}
