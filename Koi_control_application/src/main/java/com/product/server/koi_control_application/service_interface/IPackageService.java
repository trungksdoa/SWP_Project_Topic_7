package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.UserPackage;

import java.util.List;

public interface IPackageService {
    List<UserPackage> getAllPackages();
    UserPackage getPackageById(int id);
    UserPackage getPackageByDefault();
    UserPackage createPackage(UserPackage pack);
    UserPackage updatePackage(int packId, UserPackage pack);
    void deletePackage(int id);




    boolean checkFishLimit(int userId, UserPackage userPackage);

    boolean checkPondLimit(int userId, UserPackage userPackage);
}
