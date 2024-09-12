package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.PondCreationRequest;
import com.product.server.koi_control_application.dto.PondUpdateRequest;
import com.product.server.koi_control_application.model.Pond;
import org.springframework.data.domain.Page;

public interface IPondService {
    Pond addPond(PondCreationRequest request);

    Pond getPond(int id);
    Page<Pond> getPonds(int page, int size);

    void deletePond(int id);

    Pond updatePond(int id, PondUpdateRequest request);

    void updateWaterParameter(int id);
}
