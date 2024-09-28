package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.AlreadyExistedException;
import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.KoiGrowthHistoryRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service_interface.IImageService;
import com.product.server.koi_control_application.service_interface.IKoiFishService;
import com.product.server.koi_control_application.service_interface.IPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor

public class IKoiFishServiceImpl implements IKoiFishService {
    private final UsersRepository usersRepository;
    private final KoiFishRepository koiFishRepository;
    private final PondRepository pondRepository;
    private final IImageService iImageService;
    private final KoiGrowthHistoryRepository koiGrowthHistoryRepository;
    private final IPackageService iPackageService;

    @Override
    public KoiFish addKoiFish(KoiFish koiFish) {
        Users user = usersRepository.findById(koiFish.getUserId()).orElseThrow(() -> new NotFoundException("User not found."));

        if (!pondRepository.existsById(koiFish.getPondId()))
            throw new NotFoundException("Pond not found.");

        if (!pondRepository.existsByIdAndUserId(koiFish.getPondId(), koiFish.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");

        if (koiFishRepository.existsByNameAndPondId(koiFish.getName(), koiFish.getPondId()))
            throw new AlreadyExistedException("KoiFish name existed.");

        if (iPackageService.checkPackageLimit(koiFish.getUserId(), user.getAUserPackage()))
            throw new NotFoundException("User package limit exceeded.");

        KoiFish saved = koiFishRepository.save(koiFish);
        koiGrowthHistoryRepository.save(KoiGrowthHistory.builder()
                .koiId(saved.getId())
                .inPondFrom(koiFish.getCreatedAt())
                .isFirstMeasurement(true)
                .weight(koiFish.getWeight())
                .length(koiFish.getLength())
                .pondId(koiFish.getPondId())
                .build());

        return saved;
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
    public KoiFish updateKoiFish(int id, KoiFish request, MultipartFile file) throws IOException {
        KoiFish koiFish = getKoiFish(id);

        if (!usersRepository.existsById(request.getUserId()))
            throw new NotFoundException("User not found.");

        if (!pondRepository.existsByIdAndUserId(request.getPondId(), request.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");

        if (koiFishRepository.existsByNameAndPondIdExceptId(request.getName(), request.getPondId(), id))
            throw new AlreadyExistedException("KoiFish name existed.");

        if (!file.isEmpty()) {
            String filename = iImageService.updateImage(koiFish.getImageUrl(), file);
            koiFish.setImageUrl(filename);
        } else {
            koiFish.setImageUrl(koiFish.getImageUrl());
        }

        koiFish.setName(request.getName());
        koiFish.setVariety(request.getVariety());
        koiFish.setSex(request.getSex());
        koiFish.setPurchasePrice(request.getPurchasePrice());

        Pond currPond = pondRepository.findById(koiFish.getPondId()).orElseThrow(() -> new NotFoundException("Pond not found"));

        KoiGrowthHistory koiGrowthHistory = KoiGrowthHistory.builder()
                .koiId(koiFish.getId())
                .isFirstMeasurement(false)
                .weight(koiFish.getWeight())
                .length(koiFish.getLength())
                .pondId(currPond.getId())
                .build();

        if (request.getPondId() != 0) {
            koiGrowthHistory.setInPondFrom(currPond.getCreatedAt());
            koiGrowthHistory.setPondId(currPond.getId());
            koiFish.setPondId(request.getPondId());
        }


        koiGrowthHistoryRepository.save(koiGrowthHistory);
        return koiFishRepository.save(koiFish);
    }

    @Override
    public Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }
}
