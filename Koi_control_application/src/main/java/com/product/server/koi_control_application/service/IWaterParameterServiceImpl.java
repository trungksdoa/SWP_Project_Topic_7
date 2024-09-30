package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.custom_exception.NotFoundException;
import com.product.server.koi_control_application.model.WaterQualityStandard;
import com.product.server.koi_control_application.pojo.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.WaterParameterRepository;
import com.product.server.koi_control_application.repository.WaterQualityStandardRepository;
import com.product.server.koi_control_application.service_interface.IWaterParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IWaterParameterServiceImpl implements IWaterParameterService {
    private final WaterParameterRepository waterParameterRepository;
    private final PondRepository pondRepository;
    private final WaterQualityStandardRepository waterQualityStandardRepository;
    private final KoiFishRepository koiFishRepository;
    @Override
    public WaterParameter saveWaterParameter(int pondId, WaterParameter waterParameter) {

        if (!pondRepository.existsById(pondId))
            throw new NotFoundException("Pond not found.");

        if(waterParameterRepository.existsByPondId(pondId)){
            WaterParameterUpdateRequest request = new WaterParameterUpdateRequest();
            BeanUtils.copyProperties(waterParameter, request);
            return updateWaterParameter(pondId, request);
        }
            waterParameter.setPondId(pondId);
            waterParameter.setLastCleanedAt(LocalDateTime.now());
        return waterParameterRepository.save(waterParameter);
    }

    @Override
        public WaterParameter getWaterParameterByPondId(int pondId) {
            WaterParameter waterParameter = waterParameterRepository.findByPondId(pondId);
            if (waterParameter == null) {
                throw new NotFoundException("WaterParameter not found for pondId: ");
            }
            return waterParameter;
        }

    @Override
    public WaterParameter updateWaterParameter(int pondId, WaterParameterUpdateRequest request) {
        WaterParameter waterParameter = getWaterParameterByPondId(pondId);
        Optional.ofNullable(request.getNitriteNO2()).ifPresent(waterParameter::setNitriteNO2);
        Optional.ofNullable(request.getNitrateNO3()).ifPresent(waterParameter::setNitrateNO3);
        Optional.ofNullable(request.getPhosphatePO4()).ifPresent(waterParameter::setPhosphatePO4);
        Optional.ofNullable(request.getAmmoniumNH4()).ifPresent(waterParameter::setAmmoniumNH4);
        Optional.ofNullable(request.getHardnessGH()).ifPresent(waterParameter::setHardnessGH);
        Optional.ofNullable(request.getSalt()).ifPresent(waterParameter::setSalt);
        Optional.ofNullable(request.getOutdoorTemperature()).ifPresent(waterParameter::setOutdoorTemperature);
        Optional.ofNullable(request.getTemperature()).ifPresent(waterParameter::setTemperature);
        Optional.ofNullable(request.getPH()).ifPresent(waterParameter::setPH);
        Optional.ofNullable(request.getCarbonateHardnessKH()).ifPresent(waterParameter::setCarbonateHardnessKH);
        Optional.ofNullable(request.getCo2()).ifPresent(waterParameter::setCo2);
        Optional.ofNullable(request.getTotalChlorines()).ifPresent(waterParameter::setTotalChlorines);
        Optional.ofNullable(request.getAmountFed()).ifPresent(waterParameter::setAmountFed);

        if (Boolean.TRUE.equals(request.getLastCleaned())) {
            waterParameter.setLastCleanedAt(LocalDateTime.now());
        }

        return waterParameterRepository.save(waterParameter);
    }

    @Override
    public void deleteWaterParameter(int pondId) {
        WaterParameter waterParameter = getWaterParameterByPondId(pondId);
        waterParameterRepository.delete(waterParameter);
    }

    @Override
    public WaterQualityStandard saveWaterQualityStandard(WaterQualityStandard waterQualityStandard) {
        return waterQualityStandardRepository.save(waterQualityStandard);
    }

    @Override
    public WaterQualityStandard getWaterQualityByPondId(int pondId) {
        WaterQualityStandard waterQualityStandard = waterQualityStandardRepository.findByPondId(pondId);
        if (waterQualityStandard == null) {
            throw new NotFoundException("WaterQualityStandard not found ");
        }
        waterQualityStandard.calculateValues(pondRepository.findById(pondId).get().getVolume(), koiFishRepository.findAllByPondId(pondId));
        waterQualityStandardRepository.save(waterQualityStandard);
        return waterQualityStandard;
    }
}
