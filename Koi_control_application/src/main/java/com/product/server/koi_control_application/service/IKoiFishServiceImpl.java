package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.customException.AlreadyExistedException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IKoiFishService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IKoiFishServiceImpl implements IKoiFishService {
    private final UsersRepository usersRepository;
    private final KoiFishRepository koiFishRepository;
    private final PondRepository pondRepository;
    @Override
    public KoiFish addKoiFish(KoiFish koiFish) {
        if(!usersRepository.existsById(koiFish.getUserId()))
            throw new NotFoundException("User not found.");

        if(!pondRepository.existsById(koiFish.getPondId()))
            throw new NotFoundException("Pond not found.");

        if(!pondRepository.existsByIdAndUserId(koiFish.getPondId(), koiFish.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");

        if(koiFishRepository.existsByNameAndPondId(koiFish.getName(), koiFish.getPondId()))
            throw new AlreadyExistedException("KoiFish name existed.");

        return koiFishRepository.save(koiFish);
    }

    @Override
    public KoiFish getKoiFish(int id) {
        return koiFishRepository.findById(id).orElseThrow(() -> new NotFoundException("KoiFish not found"));
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
    public int countKoiFishByPondId(int pondId) {
        return koiFishRepository.countByPondId(pondId);
    }

    @Override
    public KoiFish updateKoiFish(int id, KoiFishUpdateRequest request) {
        KoiFish koiFish = getKoiFish(id);

        if(!usersRepository.existsById(request.getUserId()))
            throw new NotFoundException("User not found.");

        if(!pondRepository.existsByIdAndUserId(request.getPondId(), request.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");

        if(koiFishRepository.existsByNameAndPondIdExceptId(request.getName(), request.getPondId(), id))
            throw new AlreadyExistedException("KoiFish name existed.");



        Optional.ofNullable(request.getName()).ifPresent(koiFish::setName);
        Optional.ofNullable(request.getVariety()).ifPresent(koiFish::setVariety);
        Optional.ofNullable(request.getSex()).ifPresent(koiFish::setSex);
        Optional.ofNullable(request.getPurchasePrice()).ifPresent(koiFish::setPurchasePrice);
        Optional.ofNullable(request.getUserId()).ifPresent(koiFish::setUserId);
        Optional.ofNullable(request.getImageUrl()).ifPresent(koiFish::setImageUrl);
        Optional.ofNullable(request.getPondId()).ifPresent(koiFish::setPondId);



        return koiFishRepository.save(koiFish);
    }

    @Override
    public Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAllByUserId(userId,pageable);
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }
}
