package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.model.UserPackage;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.PackageRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.service_interface.IPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PackageServiceImpl implements IPackageService {
    private final PackageRepository packageRepository;
    private final KoiFishRepository koiFishRepository;
    private final PondRepository pondRepository;

    @Override
    public List<UserPackage> getAllPackages() {
        return packageRepository.findAll();
    }


    @Override
    public UserPackage getPackageById(int id) {
        return packageRepository.findById(id).orElseThrow(() -> new RuntimeException("Package not found"));
    }

    @Override
    public UserPackage getPackageByDefault() {
        return packageRepository.findByIsDefault(true);
    }


    @Override
    public UserPackage createPackage(UserPackage pack) {
        if (getPackageByDefault() != null && Boolean.TRUE.equals(pack.getIsDefault())) {
            throw new IllegalStateException("Cannot create another default package, please update the existing default package");
        }

        return packageRepository.save(pack);
    }

    @Override
    public UserPackage updatePackage(int packId, UserPackage pack) {
        UserPackage packageById = packageRepository.findById(packId).orElseThrow(() -> new RuntimeException("Package not found"));
        if (Boolean.TRUE.equals(pack.getIsDefault())) {
            packageRepository.updateAllIsDefault(false);
            packageById.setIsDefault(true);
        }
        Optional.ofNullable(pack.getName()).ifPresent(packageById::setName);
        Optional.of(pack.getFishSlots()).ifPresent(packageById::setFishSlots);
        Optional.of(pack.getPondSlots()).ifPresent(packageById::setPondSlots);
        Optional.of(pack.getPrice()).ifPresent(packageById::setPrice);
        return packageRepository.save(packageById);
    }

    @Override
    public void deletePackage(int id) {
        if (Boolean.TRUE.equals(getPackageById(id).getIsDefault())) {
            throw new IllegalStateException("Cannot delete default package, please set another package as default first");
        }
        packageRepository.deleteById(id);
    }


    @Override
    public boolean checkFishLimit(int userId, UserPackage userPackage) {
        Long fishCount = koiFishRepository.countByUserId(userId);
        return userPackage.getFishSlots() < fishCount;
    }

    @Override
    public boolean checkPondLimit(int userId, UserPackage userPackage) {
        int pondCount = koiFishRepository.countByPondId(userId);
        return userPackage.getPondSlots() < pondCount;
    }
}
