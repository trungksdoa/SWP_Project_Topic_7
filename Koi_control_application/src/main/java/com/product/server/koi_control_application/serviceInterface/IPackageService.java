package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.UserPackage;

import java.util.List;

/**
 * This interface defines the contract for package-related operations.
 * It provides methods for retrieving, creating, updating, and deleting user packages,
 * as well as checking limits related to fish and ponds.
 */
public interface IPackageService {

    /**
     * Retrieves all user packages.
     *
     * @return A List of UserPackage objects.
     */
    List<UserPackage> getAllPackages();

    /**
     * Retrieves a user package by its ID.
     *
     * @param id The ID of the package to retrieve.
     * @return   The UserPackage object corresponding to the provided ID.
     */
    UserPackage getPackageById(int id);

    /**
     * Retrieves the default user package.
     *
     * @return The default UserPackage object.
     */
    UserPackage getPackageByDefault();

    /**
     * Creates a new user package.
     *
     * @param pack The UserPackage object to be created.
     * @return     The created UserPackage object.
     */
    UserPackage createPackage(UserPackage pack);

    /**
     * Updates an existing user package.
     *
     * @param packId The ID of the package to update.
     * @param pack   The UserPackage object containing updated details.
     * @return       The updated UserPackage object.
     */
    UserPackage updatePackage(int packId, UserPackage pack);

    /**
     * Deletes a user package by its ID.
     *
     * @param id The ID of the package to delete.
     */
    void deletePackage(int id);

    /**
     * Checks if the fish limit for a user package is exceeded.
     *
     * @param userId      The ID of the user to check.
     * @param userPackage The UserPackage object to check against.
     * @return           true if the fish limit is not exceeded; false otherwise.
     */
    boolean checkFishLimit(int userId, UserPackage userPackage);

    /**
     * Checks if the pond limit for a user package is exceeded.
     *
     * @param userId      The ID of the user to check.
     * @param userPackage The UserPackage object to check against.
     * @return           true if the pond limit is not exceeded; false otherwise.
     */
    boolean checkPondLimit(int userId, UserPackage userPackage);

    int getFishLimit(int userId, UserPackage userPackage);

    int getPondLimit(int userId, UserPackage userPackage);

    int getFishCount(int userId);
}