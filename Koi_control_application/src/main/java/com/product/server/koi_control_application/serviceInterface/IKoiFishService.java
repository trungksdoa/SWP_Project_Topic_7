package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.dto.KoiFishCreationRequest;
import com.product.server.koi_control_application.dto.KoiFishUpdateRequest;
import com.product.server.koi_control_application.model.KoiFish;
import org.springframework.data.domain.Page;

public interface IKoiFishService {
    KoiFish addKoiFish( KoiFish koiFish);

    KoiFish getKoiFish(int id);
    Page<KoiFish> getKoiFishs(int page, int size);
    Page<KoiFish> getKoiFishsByPondId(int pondId, int page, int size);
    Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size);
    void deleteKoiFish(int id);

    KoiFish updateKoiFish(int id, KoiFishUpdateRequest request);


}
