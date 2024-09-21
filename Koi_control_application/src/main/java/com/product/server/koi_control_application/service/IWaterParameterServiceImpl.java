package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.dto.WaterParameterCreationRequest;
import com.product.server.koi_control_application.dto.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;
import com.product.server.koi_control_application.repository.WaterParameterRepository;
import com.product.server.koi_control_application.serviceInterface.IWaterParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IWaterParameterServiceImpl implements IWaterParameterService {
    private final WaterParameterRepository waterParameterRepository;
    @Override
    public WaterParameter saveWaterParameter(int pondId, WaterParameter waterParameter) {

        if(waterParameterRepository.existsByPondId(pondId)){
            WaterParameterUpdateRequest  request = new WaterParameterUpdateRequest();
            request.setNitriteNO2(waterParameter.getNitriteNO2());
            request.setNitrateNO3(waterParameter.getNitrateNO3());
            request.setPhosphatePO4(waterParameter.getPhosphatePO4());
            request.setAmmoniumNH4(waterParameter.getAmmoniumNH4());
            request.setHardnessGH(waterParameter.getHardnessGH());
            request.setSalt(waterParameter.getSalt());
            request.setOutdoorTemperature(waterParameter.getOutdoorTemperature());
            request.setTemperature(waterParameter.getTemperature());
            request.setPH(waterParameter.getPH());
            request.setCarbonateHardnessKH(waterParameter.getCarbonateHardnessKH());
            request.setCo2(waterParameter.getCo2());
            request.setTotalChlorines(waterParameter.getTotalChlorines());
            request.setAmountFed(waterParameter.getAmountFed());
            return updateWaterParameter(pondId, request);
        }
            waterParameter.setLastCleanedAt(LocalDateTime.now());

        return waterParameterRepository.save(waterParameter);
    }

    @Override
        public WaterParameter getWaterParameterByPondId(int pondId) {
            WaterParameter waterParameter = waterParameterRepository.findByPondId(pondId);
            if (waterParameter == null) {
                throw new RuntimeException("WaterParameter not found for pondId: ");
            }
            return waterParameter;
        }

    @Override
    public WaterParameter updateWaterParameter(int pondId, WaterParameterUpdateRequest request) {
        WaterParameter waterParameter = getWaterParameterByPondId(pondId);
        if (request.getNitriteNO2() != null) {
            waterParameter.setNitriteNO2(request.getNitriteNO2());
        }

        if (request.getNitrateNO3() != null) {
            waterParameter.setNitrateNO3(request.getNitrateNO3());
        }

        if (request.getPhosphatePO4() != null) {
            waterParameter.setPhosphatePO4(request.getPhosphatePO4());
        }

        if (request.getAmmoniumNH4() != null) {
            waterParameter.setAmmoniumNH4(request.getAmmoniumNH4());
        }

        if (request.getHardnessGH() != null) {
            waterParameter.setHardnessGH(request.getHardnessGH());
        }

        if (request.getSalt() != null) {
            waterParameter.setSalt(request.getSalt());
        }

        if (request.getOutdoorTemperature() != null) {
            waterParameter.setOutdoorTemperature(request.getOutdoorTemperature());
        }

        if (request.getTemperature() != null) {
            waterParameter.setTemperature(request.getTemperature());
        }

        if (request.getPH() != null) {
            waterParameter.setPH(request.getPH());
        }

        if (request.getCarbonateHardnessKH() != null) {
            waterParameter.setCarbonateHardnessKH(request.getCarbonateHardnessKH());
        }

        if (request.getCo2() != null) {
            waterParameter.setCo2(request.getCo2());
        }

        if (request.getTotalChlorines() != null) {
            waterParameter.setTotalChlorines(request.getTotalChlorines());
        }

        if (request.getAmountFed() != null) {
            waterParameter.setAmountFed(request.getAmountFed());
        }


        if (request.getLastCleaned() != null && request.getLastCleaned()) {
            waterParameter.setLastCleanedAt(LocalDateTime.now());
        }
        return waterParameterRepository.save(waterParameter);
    }

    @Override
    public void deleteWaterParameter(int pondId) {
        WaterParameter waterParameter = getWaterParameterByPondId(pondId);
        waterParameterRepository.delete(waterParameter);
    }



}
