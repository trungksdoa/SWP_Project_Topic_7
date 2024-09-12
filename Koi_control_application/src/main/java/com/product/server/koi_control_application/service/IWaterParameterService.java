package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.WaterParameterCreationRequest;
import com.product.server.koi_control_application.dto.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;

public interface IWaterParameterService {
    WaterParameter saveWaterParameter(WaterParameterCreationRequest request);

    WaterParameter getWaterParameterByPondId(int pondId);

    WaterParameter updateWaterParameter(int pondId, WaterParameterUpdateRequest request);
    void createWaterParameter(int pondId);
}
