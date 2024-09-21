package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.custom_exception.AlreadyExistedException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IPondService;
import com.product.server.koi_control_application.service_interface.IWaterParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class IPondServiceImpl implements IPondService {
    private final PondRepository pondRepository;
    private final UsersRepository usersRepository;
    private final IKoiFishServiceImpl  iKoiFishService;
    private final IWaterParameterService iWaterParameterService;
    private final IImageService iImageService;
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
    public Pond updatePond(int id, Pond request, MultipartFile file) throws IOException {
        Pond pond = getPond(id);
        if(!usersRepository.existsById(request.getUserId()))
            throw new NotFoundException("User not found.");
        if(pondRepository.existsByNameAndUserIdExceptId(request.getName(), request.getUserId(), id))
            throw new AlreadyExistedException("Pond name existed.");


        if(file != null) {
            String filename = iImageService.updateImage(pond.getImageUrl(), file);
            pond.setImageUrl(filename);
        }else{
            pond.setImageUrl(pond.getImageUrl());
        }


        pond.setName(request.getName());
        pond.setImageUrl(request.getImageUrl());
        pond.setWidth(request.getWidth());
        pond.setLength(request.getLength());
        pond.setDepth(request.getDepth());
        pond.setVolume(request.getVolume());
        pond.setFishCount(iKoiFishService.countKoiFishByPondId(id));

        return pondRepository.save(pond);
    }

}


