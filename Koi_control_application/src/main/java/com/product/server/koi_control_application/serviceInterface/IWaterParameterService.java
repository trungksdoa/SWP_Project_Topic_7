package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.dto.WaterParameterCreationRequest;
import com.product.server.koi_control_application.dto.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;

public interface IWaterParameterService {
    WaterParameter saveWaterParameter(WaterParameter waterParameter);

    WaterParameter getWaterParameterByPondId(int pondId);

    WaterParameter updateWaterParameter(int pondId, WaterParameterUpdateRequest request);
    void deleteWaterParameter(int pondId);
}
