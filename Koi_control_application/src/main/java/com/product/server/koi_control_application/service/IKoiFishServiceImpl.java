package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.customException.AlreadyExistedException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import com.product.server.koi_control_application.model.Pond;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.KoiGrowthHistoryRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.serviceInterface.IImageService;
import com.product.server.koi_control_application.serviceInterface.IKoiFishService;
import com.product.server.koi_control_application.serviceInterface.IPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
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

        if (!pondRepository.existsById(koiFish.getPondId()))
            throw new NotFoundException("Pond not found.");

        if (!pondRepository.existsByIdAndUserId(koiFish.getPondId(), koiFish.getUserId()))
            throw new NotFoundException("This Breeder dont have this Pond!.");

        if (koiFishRepository.existsByNameAndPondId(koiFish.getName(), koiFish.getPondId()))
            throw new AlreadyExistedException("KoiFish name existed.");

        if (iPackageService.checkFishLimit(koiFish.getUserId(), user.getAUserPackage()))
            throw new NotFoundException("User package limit exceeded.");
        koiFish.setInPondFrom(koiFish.getDate());
        KoiFish saved = koiFishRepository.save(koiFish);
        koiGrowthHistoryRepository.save(KoiGrowthHistory.builder()
                .koiId(saved.getId())
                .isFirstMeasurement(true)
                .inPondFrom(koiFish.getDate())
                .weight(koiFish.getWeight())
                .length(koiFish.getLength())
                .pondId(koiFish.getPondId())
                .date(koiFish.getDate())
                .dateOfBirth(saved.getDateOfBirth())
                .build());
        evaluateAndUpdateKoiGrowthStatus(saved.getId());
        return getKoiFishsaved(saved.getId());
    }

    @Override
    public KoiFish getKoiFish(int id) {
        KoiFish koiFish = koiFishRepository.findById(id).orElseThrow(() -> new NotFoundException("KoiFish not found"));
        return koiFish;
    }

    @Override
    public KoiFish getKoiFishsaved(int id) {
        KoiFish koiFish = koiFishRepository.findById(id).orElseThrow(() -> new NotFoundException("KoiFish not found"));
        evaluateAndUpdateKoiFishStatus(koiFish);
        koiFish.countageMonth();
        koiFishRepository.save(koiFish);
        return koiFish;
    }

    @Override
    public Page<KoiFish> getKoiFishsByPondId(int pondId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<KoiFish> koiFishs = koiFishRepository.findAllByPondId(pondId, pageable);
        for (KoiFish koiFish : koiFishs) {
            koiFish.countageMonth();
            koiFishRepository.save(koiFish);
        }
        return koiFishs;
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
    public KoiFish updateKoiFish(int id, KoiFish request, MultipartFile file, boolean isNew) throws IOException {
        KoiFish koiFish = getKoiFish(id);

        if (request.getUserId()!=0 && !usersRepository.existsById(request.getUserId()))
            throw new NotFoundException("User not found.");

        if ((request.getPondId()!= 0) && !pondRepository.existsByIdAndUserId(request.getPondId(), request.getUserId()))
            throw new NotFoundException("Pond not found");

        if (koiFishRepository.existsByNameAndPondIdExceptId(request.getName(), request.getPondId(), id))
            throw new AlreadyExistedException("KoiFish name existed.");

        if(file != null && !file.isEmpty()){
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
        Optional.ofNullable(request.getPurchasePrice()).ifPresent(koiFish::setPurchasePrice);
        Optional.ofNullable(request.getDate()).ifPresent(koiFish::setDate);
        if ((request.getPondId()!= 0)){
            if(koiFish.getPondId()!= request.getPondId()){
                koiFish.setInPondFrom(request.getDate());
            }
            koiFish.setPondId(request.getPondId());
        }

        KoiGrowthHistory.KoiGrowthHistoryBuilder builder = KoiGrowthHistory.builder()
                .koiId(koiFish.getId())
                .isFirstMeasurement(false)
                .dateOfBirth(koiFish.getDateOfBirth())
                .inPondFrom(koiFish.getInPondFrom())
                .weight(request.getWeight())
                .length(request.getLength())
                .pondId(koiFish.getPondId())
                .date(koiFish.getDate());


        if (!isNew) {
            builder.id(getLastestKoigrownId(koiFish.getId()));
        }
        koiGrowthHistoryRepository.save(builder.build());

        if (request.getDateOfBirth()!= null && request.getDateOfBirth()!= koiFish.getDateOfBirth()){
            koiFish.setDateOfBirth(request.getDateOfBirth());
            koiFish.setAgeMonth(null);
            koiFishRepository.save(koiFish);
            List<KoiGrowthHistory> koiGrowthHistories = getGrowthHistorys(koiFish.getId());
            for(KoiGrowthHistory koifishgrowth : koiGrowthHistories){
                koifishgrowth.setDateOfBirth(koiFish.getDateOfBirth());
                koiGrowthHistoryRepository.save(koifishgrowth);
            }

        }
        else if(request.getAgeMonth()   != null && koiFish.getAgeMonth().equals(request.getAgeMonth())){
            koiFish.setAgeMonth(request.getAgeMonth());
            koiFish.setDateOfBirth(null);
            koiFishRepository.save(koiFish);
            List<KoiGrowthHistory> koiGrowthHistories = getGrowthHistorys(koiFish.getId());
            for(KoiGrowthHistory koifishgrowth : koiGrowthHistories) {
                koifishgrowth.setDateOfBirth(koiFish.getDateOfBirth());
                koiGrowthHistoryRepository.save(koifishgrowth);
            }
        }


        evaluateAndUpdateKoiGrowthStatus(id);

        return getKoiFishsaved(id);
    }

    @Override
    public Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KoiFish> koiFishs = koiFishRepository.findAllByUserId(userId, pageable);
        for (KoiFish koiFish : koiFishs) {
            koiFish.countageMonth();
            koiFishRepository.save(koiFish);
        }
        return koiFishs;
    }

    @Override
    public Page<KoiFish> getKoiFishs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return koiFishRepository.findAll(pageable);
    }


    @Override
    public KoiGrowthHistory addGrowthHistory(int id, KoiGrowthHistory request) {
        KoiFish koiFish = getKoiFish(id);

        if ((request.getPondId()!= 0) && !pondRepository.existsByIdAndUserId(request.getPondId(), koiFish.getUserId()))
            throw new NotFoundException("Pond not found");

        KoiGrowthHistory.KoiGrowthHistoryBuilder builder = KoiGrowthHistory.builder()
                .koiId(koiFish.getId())
                .isFirstMeasurement(false)
                .dateOfBirth(koiFish.getDateOfBirth())
                .inPondFrom(request.getDate())
                .weight(request.getWeight())
                .length(request.getLength())
                .pondId(request.getPondId())
                .date(request.getDate());

       KoiGrowthHistory saved = koiGrowthHistoryRepository.save(builder.build());

       evaluateAndUpdateKoiGrowthStatus(id);


        return getGrowthHistory(saved.getId());
    }

    @Override
    public KoiGrowthHistory getGrowthHistory(int id) {
        return koiGrowthHistoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Growth history not found"));
    }

    @Override
    public Page<KoiGrowthHistory> getGrowthHistorys(int koiId,int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("date").ascending());

        return koiGrowthHistoryRepository.findAllByKoiId(koiId, pageable);
    }

    @Override
    public void UpdateKoiFishGrowth(int koiId) {
        List<KoiGrowthHistory> koiGrowthHistories = koiGrowthHistoryRepository.findAllByKoiId(koiId);
        koiGrowthHistories.sort(Comparator.comparing(KoiGrowthHistory::getDate));


    }

    @Override
    public void evaluateAndUpdateKoiGrowthStatus(int koiId) {
        List<KoiGrowthHistory> koiGrowthHistories = koiGrowthHistoryRepository.findAllByKoiId(koiId);
        koiGrowthHistories.sort(Comparator.comparing(KoiGrowthHistory::getDate));
        if (koiGrowthHistories.size() == 1) {
            koiGrowthHistories.get(0).setStatus(4);
            koiGrowthHistoryRepository.save(koiGrowthHistories.get(0));
            return;
        }
        KoiGrowthHistory previousHistory = null;
        LocalDate firstDateInCluster = null;
        for (KoiGrowthHistory currentHistory : koiGrowthHistories) {
            if (previousHistory != null) {

                // So sánh với bản ghi trước đó
                double ageMonth = currentHistory.getAgeMonthHis();
                double previousLength = previousHistory.getLength() != null ? previousHistory.getLength().doubleValue() : 0.0;
                double currentLength = currentHistory.getLength() != null ? currentHistory.getLength().doubleValue() : 0.0;
                // Tính sự thay đổi kích thước
                double growth = currentLength - previousLength;
                // Tính kích thước kỳ vọng cho khoảng thời gian giữa hai lần đo
                double expectedGrowth = calculateExpectedGrowth(previousLength, previousHistory.getAgeMonthHis(), ageMonth);
                // Đánh giá từng lần phát triển và cập nhật status
                if (growth < expectedGrowth * 0.9) {
                    currentHistory.setStatus(1);
                } else if (growth > expectedGrowth * 1.1) {
                    currentHistory.setStatus(2);
                } else {
                    currentHistory.setStatus(3);
                }

                //update inPondfrom
                if (!currentHistory.getPondId().equals(previousHistory.getPondId())) {
                    currentHistory.setInPondFrom(currentHistory.getDate());
                    firstDateInCluster = currentHistory.getDate();
                } else {

                    currentHistory.setInPondFrom(firstDateInCluster);
                }




            }else {
                currentHistory.setStatus(3);
                firstDateInCluster = currentHistory.getDate();
                currentHistory.setInPondFrom(firstDateInCluster);
            }
            //Lưu bản ghi đã cập nhật lại vào cơ sở dữ liệu
            koiGrowthHistoryRepository.save(currentHistory);
            // Cập nhật bản ghi trước đó
            previousHistory = currentHistory;
        }
    }

    private double calculateExpectedGrowth(double previousLength, double previousAgeMonth, double currentAgeMonth) {
        double expectedGrowth = 0.0;

        for (double ageMonth = previousAgeMonth + 1; ageMonth <= currentAgeMonth; ageMonth++) {
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

    @Override
    public List<KoiFish> getKoiFishsByPondId(int pondId) {
        List<KoiFish> koiFishs = koiFishRepository.findAllByPondId(pondId);
        for (KoiFish koiFish : koiFishs) {
            koiFish.countageMonth();
            koiFishRepository.save(koiFish);
        }
        return koiFishs;
    }

    @Override
    public List<KoiFish> getKoiFishsByUserId(int userId) {
        List<KoiFish> koiFishs = koiFishRepository.findAllByUserId(userId);
        for (KoiFish koiFish : koiFishs) {
            koiFish.countageMonth();
            koiFishRepository.save(koiFish);
        }
        return koiFishs;
    }

    @Override
    public List<KoiFish> getFishByUserNoPond(int userId) {
        return List.of();
    }

    @Override
    public List<KoiGrowthHistory> getGrowthHistorys(int koiId) {
        List<KoiGrowthHistory> koiGrowthHistories = koiGrowthHistoryRepository.findAllByKoiId(koiId);
        koiGrowthHistories.sort(Comparator.comparing(KoiGrowthHistory::getDate));
        return koiGrowthHistories;
    }

    @Override
    public void evaluateAndUpdateKoiFishStatus(KoiFish koiFish) {

        List<KoiGrowthHistory> koiGrowthHistories = getGrowthHistorys(koiFish.getId());
        if (koiGrowthHistories.size() == 1) {
            koiFish.setStatus(5);
            koiFishRepository.save(koiFish);
            return;
        }
        boolean hasSlowGrowth = false;
        boolean hasFastGrowth = false;
        boolean hasNormalGrowth = false;

        for (KoiGrowthHistory history : koiGrowthHistories) {

            int status = history.getStatus();
            switch (status){
                case 1:
                    hasSlowGrowth = true;
                    break;
                case 2:
                    hasFastGrowth = true;
                    break;
            }

        }
        int finalStatus;
        if (hasSlowGrowth && hasFastGrowth) {
            finalStatus = 1; // Ưu tiên trạng thái chậm nếu có cả nhanh và chậm
        } else if (hasSlowGrowth) {
            finalStatus = 2; // Tăng trưởng chậm
        } else if (hasFastGrowth) {
            finalStatus = 3; // Tăng trưởng nhanh
        } else {
            finalStatus = 4; // Tăng trưởng bình thường
        }
        koiFish.setStatus(finalStatus);
        koiFishRepository.save(koiFish);

    }
    @Override
    public int getLastestKoigrownId(int koiId){
        List<KoiGrowthHistory> koiGrowthHistories = koiGrowthHistoryRepository.findAllByKoiId(koiId);
        koiGrowthHistories.sort(Comparator.comparing(KoiGrowthHistory::getDate));
        return koiGrowthHistories.get(koiGrowthHistories.size() - 1).getId();
    }

    @Override
    public List<KoiFish> swapPondIdListKoi(int pondId, List<Integer> koiFishId) {
        Pond pond   =  pondRepository.findById(pondId).orElseThrow(() -> new NotFoundException("Pond not found."));
        Users user = usersRepository.findById(pond.getUserId()).orElseThrow(() -> new NotFoundException("User not found."));
        int slot = iPackageService.getFishLimit(user.getId(), user.getAUserPackage());

        int fishcount  = pond.getFishCount();
        List<KoiFish> koiFishList = null;
        if(slot-fishcount >= koiFishId.size()){
            for (Integer id : koiFishId) {
                KoiFish koiFish1 = getKoiFish(id);
                koiFish1.setPondId(pondId);
                koiFish1.setInPondFrom(LocalDate.now());
                koiFish1.setDate(LocalDate.now());
                KoiGrowthHistory.KoiGrowthHistoryBuilder builder = KoiGrowthHistory.builder()
                        .koiId(koiFish1.getId())
                        .isFirstMeasurement(false)
                        .dateOfBirth(koiFish1.getDateOfBirth())
                        .inPondFrom(koiFish1.getInPondFrom())
                        .weight(koiFish1.getWeight())
                        .length(koiFish1.getLength())
                        .pondId(koiFish1.getPondId())
                        .date(koiFish1.getDate());
                koiGrowthHistoryRepository.save(builder.build());

                koiFishRepository.save(koiFish1);
                koiFishList.add(getKoiFish(koiFish1.getId()));
            }
        }else {
            throw new NotFoundException("User package limit exceeded.(Fish)");
        }

        return koiFishList;
    }

    @Override
    public void deleteGrowthHistory(int id) {
        KoiGrowthHistory koiGrowthHistory = getGrowthHistory(id);
        if(koiGrowthHistory.getId()==getLastestKoigrownId(koiGrowthHistory.getKoiId())){
            throw new NotFoundException("Cannot delete the latest growth history.");
        }else{
        koiGrowthHistoryRepository.deleteById(id);
        }
        evaluateAndUpdateKoiGrowthStatus(koiGrowthHistory.getKoiId());
    }
}
