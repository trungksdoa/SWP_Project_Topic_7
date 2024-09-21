package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.customException.AlreadyExistedException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.dto.PondUpdateRequest;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IPondService;
import com.product.server.koi_control_application.serviceInterface.IWaterParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class IPondServiceImpl implements IPondService {
    private final PondRepository pondRepository;
    private final UsersRepository usersRepository;
    private final IKoiFishServiceImpl  iKoiFishService;
    private final IWaterParameterService iWaterParameterService;

    @Override
    public Pond addPond(Pond pond) {

        if(!usersRepository.existsById(pond.getUserId()))
            throw new NotFoundException("User not found.");

        if(pondRepository.existsByNameAndUserId(pond.getName(), pond.getUserId()))
            throw new AlreadyExistedException("Pond name existed.");

        pond.setFishCount(iKoiFishService.countKoiFishByPondId(pond.getId()));

        return pondRepository.save(pond);
    }

    @Override
    public Pond getPond(int id) {
        return pondRepository.findById(id).orElseThrow(() -> new NotFoundException("Pond not found"));
    }

    @Override
    public Page<Pond> getPonds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return pondRepository.findAll(pageable);
    }

    @Override
    public Page<Pond> getAllPondByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return pondRepository.findAllByUserId(userId,pageable);
    }

    @Override
    public void deletePond(int id) {
        Pond pond = getPond(id);
        pondRepository.delete(pond);
    }

    @Override
    public Pond updatePond(int id, PondUpdateRequest request) {
        Pond pond = getPond(id);
        if(!usersRepository.existsById(request.getUserId()))
            throw new NotFoundException("User not found.");
        if(pondRepository.existsByNameAndUserIdExceptId(request.getName(), request.getUserId(), id))
            throw new AlreadyExistedException("Pond name existed.");

        Optional.ofNullable(request.getName()).ifPresent(pond::setName);
        Optional.ofNullable(request.getImageUrl()).ifPresent(pond::setImageUrl);
        Optional.ofNullable(request.getWidth()).ifPresent(pond::setWidth);
        Optional.ofNullable(request.getLength()).ifPresent(pond::setLength);
        Optional.ofNullable(request.getDepth()).ifPresent(pond::setDepth);
        Optional.ofNullable(request.getVolume()).ifPresent(pond::setVolume);
        Optional.ofNullable(request.getUserId()).ifPresent(pond::setUserId);
        pond.setFishCount(iKoiFishService.countKoiFishByPondId(id));

        return pondRepository.save(pond);
    }

}


