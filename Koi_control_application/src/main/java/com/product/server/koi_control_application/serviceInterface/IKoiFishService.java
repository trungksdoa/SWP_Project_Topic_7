package com.product.server.koi_control_application.serviceInterface;

import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IKoiFishService {
    KoiFish addKoiFish( KoiFish koiFish);
    KoiFish getKoiFish(int id);
    KoiFish getKoiFishsaved(int id);
    Page<KoiFish> getKoiFishs(int page, int size);
    Page<KoiFish> getKoiFishsByPondId(int pondId, int page, int size);
    Page<KoiFish> getKoiFishsByUserId(int userId, int page, int size);

    List<KoiFish>   getKoiFishsByPondId(int pondId);
    List<KoiFish>   getKoiFishsByUserId(int userId);
    List<KoiFish> getFishByUserNoPond(int userId);
    void deleteKoiFish(int id);
    int getLastestKoigrownId(int koiId);
    int countKoiFishByPondId(int pondId);
    KoiFish updateKoiFish(int id, KoiFish request, MultipartFile file, boolean isNew) throws IOException;
    Page<KoiGrowthHistory> getGrowthHistorys(int koiId,int page, int size);
    List<KoiGrowthHistory> getGrowthHistorys(int koiId);
    KoiFish addGrowthHistory(int id, KoiFish request, MultipartFile file) throws IOException;
    void evaluateAndUpdateKoiGrowthStatus(int koiId);
    void evaluateAndUpdateKoiFishStatus(KoiFish koiFish);
    void UpdateKoiFishGrowth(int koiId);
}
