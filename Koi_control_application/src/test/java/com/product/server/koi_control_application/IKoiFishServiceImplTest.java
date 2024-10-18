package com.product.server.koi_control_application;

import com.product.server.koi_control_application.customException.AlreadyExistedException;
import com.product.server.koi_control_application.customException.NotFoundException;
import com.product.server.koi_control_application.model.KoiFish;
import com.product.server.koi_control_application.model.KoiGrowthHistory;
import com.product.server.koi_control_application.model.Users;
import com.product.server.koi_control_application.repository.KoiFishRepository;
import com.product.server.koi_control_application.repository.KoiGrowthHistoryRepository;
import com.product.server.koi_control_application.repository.PondRepository;
import com.product.server.koi_control_application.repository.UsersRepository;
import com.product.server.koi_control_application.service.IKoiFishServiceImpl;
import com.product.server.koi_control_application.serviceInterface.IPackageService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Transactional
class IKoiFishServiceImplTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private KoiFishRepository koiFishRepository;

    @Mock
    private PondRepository pondRepository;

    @Mock
    private KoiGrowthHistoryRepository koiGrowthHistoryRepository;

    @Mock
    private IPackageService iPackageService;

    @InjectMocks
    private IKoiFishServiceImpl koiFishService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addKoiFish() {

        KoiFish koiFish = new KoiFish();
        koiFish.setName("Golden Koi");
        koiFish.setUserId(1);
        koiFish.setPondId(10);
        koiFish.setWeight(BigDecimal.valueOf(100.0));
        koiFish.setLength(BigDecimal.valueOf(20.0));
        koiFish.setDate(LocalDate.now());
        koiFish.setDateOfBirth(LocalDate.of(2023, 1, 1));

        // Tạo đối tượng User để kiểm tra
        Users user = new Users();
        user.setId(1);


        KoiFish savedKoiFish = new KoiFish();
        savedKoiFish.setId(1);
        savedKoiFish.setName("Golden Koi");


        when(usersRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        when(pondRepository.existsById(10)).thenReturn(true);
        when(pondRepository.existsByIdAndUserId(10, 1)).thenReturn(true);
        when(iPackageService.checkFishLimit(anyInt(), any())).thenReturn(false);
        when(koiFishRepository.existsByNameAndPondId(anyString(), anyInt())).thenReturn(false);
        when(koiFishRepository.save(any(KoiFish.class))).thenReturn(koiFish);
        when(koiFishRepository.findById(anyInt())).thenReturn(Optional.of(savedKoiFish));


        KoiFish result = koiFishService.addKoiFish(koiFish);


        assertNotNull(result);


        verify(koiFishRepository, times(3)).save(any(KoiFish.class));


        verify(koiGrowthHistoryRepository, atLeastOnce()).save(any(KoiGrowthHistory.class));
    }

    @Test
    void addKoiFish_UserNotFound() {

        KoiFish koiFish = new KoiFish();
        koiFish.setUserId(1);


        when(usersRepository.findById(1)).thenReturn(java.util.Optional.empty());


        try {
            koiFishService.addKoiFish(koiFish);
        } catch (NotFoundException e) {
            assertEquals("User not found.", e.getMessage());
        }

        verify(usersRepository).findById(1);
        verify(koiFishRepository, never()).save(any(KoiFish.class));
    }

    @Test
    void addKoiFish_AlreadyExistedException() {

        KoiFish koiFish = new KoiFish();
        koiFish.setUserId(1);
        koiFish.setPondId(10);
        koiFish.setName("Golden Koi");


        Users user = new Users();
        user.setId(1);


        when(usersRepository.findById(1)).thenReturn(java.util.Optional.of(user));
        when(pondRepository.existsById(10)).thenReturn(true);
        when(pondRepository.existsByIdAndUserId(10, 1)).thenReturn(true);
        when(koiFishRepository.existsByNameAndPondId("Golden Koi", 10)).thenReturn(true);


        try {
            koiFishService.addKoiFish(koiFish);
        } catch (AlreadyExistedException e) {
            assertEquals("KoiFish name existed.", e.getMessage());
        }

        verify(koiFishRepository, never()).save(any(KoiFish.class));
    }
}