package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.pojo.WaterParameterUpdateRequest;
import com.product.server.koi_control_application.model.WaterParameter;

public interface IWaterParameterService {
    WaterParameter saveWaterParameter(int pondId,WaterParameter waterParameter);

    WaterParameter getWaterParameterByPondId(int pondId);
    WaterParameter updateWaterParameter(int pondId, WaterParameterUpdateRequest request);
    void deleteWaterParameter(int pondId);
}
