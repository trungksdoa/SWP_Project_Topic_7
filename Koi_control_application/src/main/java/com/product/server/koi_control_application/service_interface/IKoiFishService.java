package com.product.server.koi_control_application.service_interface;

import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IKoiFishService {
    KoiFish addKoiFish( KoiFish koiFish);
    KoiFish getKoiFish(int id);
    Page<KoiFish> getKoiFishs(int page, int size);
    Page<KoiFish> getKoiFishsByPondId(int pondId, int page, int size);
    Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size);
    void deleteKoiFish(int id);
    int countKoiFishByPondId(int pondId);
    KoiFish updateKoiFish(int id, KoiFish request, MultipartFile file) throws IOException;
    Page<KoiGrowthHistory> getGrowthHistorys(int koiId,int page, int size);
    KoiGrowthHistory addGrowthHistory(KoiGrowthHistory koiGrowthHistory);
    void evaluateAndUpdateKoiGrowthStatus(int koiId);
}
