package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.PondCreationRequest;
import com.product.server.koi_control_application.dto.PondUpdateRequest;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class IPondServiceImpl implements  IPondService {
    private final PondRepository pondRepository;
    private final UsersRepository usersRepository;
    private final IWaterParameterService iWaterParameterService;

    @Override
    public Pond addPond(Pond pond) {

        if(!usersRepository.existsById(pond.getBreeder()))
            throw new RuntimeException("User not found.");

        if(pondRepository.existsByNameAndBreeder(pond.getName(), pond.getBreeder()))
            throw new RuntimeException("Pond name existed.");


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
    public Page<Pond> getAllPondByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return pondRepository.findAllByBreeder(userId,pageable);
    }

    @Override
    public void deletePond(int id) {
        Pond pond = getPond(id);
        pondRepository.delete(pond);
    }

    @Override
    public Pond updatePond(int id, PondUpdateRequest request) {
        Pond pond = getPond(id);
        if(!usersRepository.existsById(request.getBreeder()))
            throw new RuntimeException("User not found.");
        if(pondRepository.existsByNameAndBreederExceptId(request.getName(), request.getBreeder(), id))
            throw new RuntimeException("Pond name existed.");
        pond.setName(request.getName());
        pond.setImageUrl(request.getImageUrl());
        pond.setWidth(request.getWidth());
        pond.setLength(request.getLength());
        pond.setDepth(request.getDepth());
        pond.setFishCount(request.getFishCount());
        pond.setBreeder(request.getBreeder());

        return pondRepository.save(pond);
    }

}


