package com.product.server.koi_control_application.service;

import com.product.server.koi_control_application.dto.KoiFishCreationRequest;
import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import org.springframework.data.domain.Page;

public interface IKoiFishService {
    KoiFish addKoiFish(KoiFishCreationRequest request);

    KoiFish getKoiFish(int id);
    Page<KoiFish> getKoiFishs(int page, int size);

    void deleteKoiFish(int id);

    KoiFish updateKoiFish(int id, KoiFishUpdateRequest request);


}
