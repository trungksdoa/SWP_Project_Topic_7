package com.product.server.koi_control_application.service;


import com.product.server.koi_control_application.dto.WaterParameterCreationRequest;
import com.product.server.koi_control_application.dto.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;
import com.product.server.koi_control_application.repository.WaterParameterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IWaterParameterServiceImpl implements IWaterParameterService {
    private final WaterParameterRepository waterParameterRepository;
    @Override
    public WaterParameter saveWaterParameter(WaterParameter waterParameter) {

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
            //Todo
        return null;
    }

    @Override
    public void deleteWaterParameter(int pondId) {

    }



}
