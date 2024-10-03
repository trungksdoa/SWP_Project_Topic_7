package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.AlreadyExistedException;
import com.product.server.koi_control_application.custom_exception.BadRequestException;
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
import java.util.List;
import java.util.Optional;

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

        if (koiFish.getPondId() != null && !pondRepository.existsById(koiFish.getPondId()))
            throw new NotFoundException("Pond not found.");

        if (koiFish.getPondId() != null && !pondRepository.existsByIdAndUserId(koiFish.getPondId(), koiFish.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");


        if(koiFishRepository.existsByNameWithUserId(koiFish.getName(), koiFish.getUserId()))
            throw new AlreadyExistedException("KoiFish name existed.");

        if (koiFish.getPondId() != null && iPackageService.checkPondLimit(koiFish.getUserId(), user.getAUserPackage()))
            throw new BadRequestException("Pond is full. , please upgrade your package.");

        if (koiFish.getPondId() != null) {
            Pond pond = pondRepository.findById(koiFish.getPondId()).orElseThrow(() -> new NotFoundException("Pond not found"));
            pond.increaseFishCount();
            pondRepository.save(pond);
        }

        KoiFish saved = koiFishRepository.save(koiFish);

        koiGrowthHistoryRepository.save(KoiGrowthHistory.builder()
                .koiId(saved.getId())
                .inPondFrom(koiFish.getDate())
                .isFirstMeasurement(true)
                .weight(koiFish.getWeight())
                .length(koiFish.getLength())
                .pondId(koiFish.getPondId())
                .date(koiFish.getDate())
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
        KoiFish koiFish = getKoiFish(id);
        Pond currPond = pondRepository.findById(koiFish.getPondId()).orElseThrow(() -> new NotFoundException("Pond not found"));
        currPond.decreaseFishCount();
        pondRepository.save(currPond);
        koiFishRepository.deleteById(id);
    }

    @Override
    public int countKoiFishByPondId(int pondId) {
        return koiFishRepository.countByPondId(pondId);
    }

    @Override
    public KoiFish updateKoiFish(int id, KoiFish request, MultipartFile file) throws IOException {
        KoiFish koiFish = getKoiFish(id);

        if(!koiFishRepository.isOwnByUser(request.getUserId()))
            throw new NotFoundException("Fish is not owned by user., try again.");

        if(koiFishRepository.existsByNameWithUserId(request.getName(), request.getUserId()))
            throw new AlreadyExistedException("KoiFish name existed.");

        if (request.getPondId() != null && !pondRepository.existsById(request.getPondId()))
            throw new NotFoundException("Pond not found.");

        if ((request.getPondId() != null) && !pondRepository.existsByIdAndUserId(request.getPondId(), request.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");



        if (file != null && !file.isEmpty()) {
            String filename = iImageService.updateImage(koiFish.getImageUrl(), file);
            koiFish.setImageUrl(filename);
        } else {
            koiFish.setImageUrl(koiFish.getImageUrl());
        }

        Optional.ofNullable(request.getWeight()).ifPresent(koiFish::setWeight);
        Optional.ofNullable(request.getLength()).ifPresent(koiFish::setLength);
        Optional.ofNullable(request.getName()).ifPresent(koiFish::setName);
        Optional.ofNullable(request.getVariety()).ifPresent(koiFish::setVariety);
        Optional.ofNullable(request.getSex()).ifPresent(koiFish::setSex);
        Optional.of(request.getPurchasePrice()).ifPresent(koiFish::setPurchasePrice);

        KoiGrowthHistory growthHistory = KoiGrowthHistory.builder()
                .koiId(koiFish.getId())
                .inPondFrom(koiFish.getDate())
                .isFirstMeasurement(false)
                .weight(request.getWeight())
                .length(request.getLength())
                .date(koiFish.getDate())
                .build();


        if ((koiFish.getPondId() != null )) {
            koiFish.setPondId(request.getPondId());
            growthHistory.setPondId(request.getPondId());
            Pond pond = pondRepository.findById(koiFish.getPondId()).orElseThrow(() -> new NotFoundException("Pond not found"));
            pond.increaseFishCount();
            pondRepository.save(pond);
        }

        koiGrowthHistoryRepository.save(growthHistory);
        return koiFishRepository.save(koiFish);
    }

    @Override
    public Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAllByUserId(userId, pageable);
    }

    @Override
    public List<KoiFish> getKoiFishsByPondId(int pondId) {
        return koiFishRepository.findAllByPondId(pondId);
    }

    @Override
    public List<KoiFish> getKoiFishsByUserId(int userId) {
        return koiFishRepository.findAllByUserId(userId);
    }

    @Override
    public List<KoiFish> getFishByUserNoPond(int userId) {
        return koiFishRepository.findFishByUserWithNoPond(userId);
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }

    @Override
    public KoiGrowthHistory addGrowthHistory(KoiGrowthHistory koiGrowthHistory) {
        return koiGrowthHistoryRepository.save(koiGrowthHistory);
    }

    @Override
    public Page<KoiGrowthHistory> getGrowthHistorys(int koiId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiGrowthHistoryRepository.findAllByKoiId(koiId, pageable);
    }

    @Override
    public List<KoiGrowthHistory> getGrowthHistorys(int koiId) {
        return koiGrowthHistoryRepository.findAllByKoiId(koiId);
    }

    @Override
    public void evaluateAndUpdateKoiGrowthStatus(int koiId) {
        List<KoiGrowthHistory> koiGrowthHistories = koiGrowthHistoryRepository.findAllByKoiId(koiId);
        if (koiGrowthHistories == null || koiGrowthHistories.isEmpty()) {
            throw new IllegalArgumentException("Không có dữ liệu phát triển cho cá Koi với ID: " + koiId);
        }
        KoiGrowthHistory previousHistory = null;
        for (KoiGrowthHistory currentHistory : koiGrowthHistories) {
            if (previousHistory != null) {
                // So sánh với bản ghi trước đó
                int ageMonth = currentHistory.getAgeMonthHis();
                double previousLength = previousHistory.getLength() != null ? previousHistory.getLength().doubleValue() : 0.0;
                double currentLength = currentHistory.getLength() != null ? currentHistory.getLength().doubleValue() : 0.0;
                // Tính sự thay đổi kích thước
                double growth = currentLength - previousLength;
                // Tính kích thước kỳ vọng cho khoảng thời gian giữa hai lần đo
                double expectedGrowth = calculateExpectedGrowth(previousLength, previousHistory.getAgeMonthHis(), ageMonth);
                // Đánh giá từng lần phát triển và cập nhật status
                if (growth < expectedGrowth * 0.9) {
                    currentHistory.setStatus("Tăng trưởng chậm");
                } else if (growth > expectedGrowth * 1.1) {
                    currentHistory.setStatus("Tăng trưởng nhanh");
                } else {
                    currentHistory.setStatus("Tăng trưởng bình thường");
                }

                // Lưu bản ghi đã cập nhật lại vào cơ sở dữ liệu
                koiGrowthHistoryRepository.save(currentHistory);
            }
            // Cập nhật bản ghi trước đó
            previousHistory = currentHistory;
        }
    }

    private double calculateExpectedGrowth(double previousLength, int previousAgeMonth, int currentAgeMonth) {
        double expectedGrowth = 0.0;

        for (int ageMonth = previousAgeMonth + 1; ageMonth <= currentAgeMonth; ageMonth++) {
            if (ageMonth <= 2) {
                expectedGrowth += previousLength * (2 - 1) / 2;  // Tăng gấp đôi kích cỡ trong 2 tháng
            } else if (ageMonth <= 6) {
                expectedGrowth += 2.5;  // Tăng 2-3 cm mỗi tháng
            } else if (ageMonth <= 12) {
                expectedGrowth += 1.5;  // Tăng 1-2 cm mỗi tháng
            } else {
                expectedGrowth += 0.5;  // Sau 12 tháng: tăng trưởng chậm dần
            }
        }

        return expectedGrowth;
    }


}
