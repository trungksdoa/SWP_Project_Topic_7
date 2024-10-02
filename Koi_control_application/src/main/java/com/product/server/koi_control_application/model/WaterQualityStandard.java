package com.product.server.koi_control_application.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;


@Entity
@Table(name = "water_quality_standard")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterQualityStandard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(name = "pond_id", nullable = false)
    private int pondId;

    // Nitrate (NO3^-), max = 40 mg/L
    @Column(name = "no3_standard",precision = 10, scale = 2)
    private BigDecimal no3Standard = new BigDecimal("40.00");

    // Nitrite (NO2^-), max = 0.25 mg/L
    @Column(name = "no2_standard",precision = 10, scale = 2)
    private BigDecimal no2Standard = new BigDecimal("0.25");

    // Ammonia (NH3), max = 0.01 mg/L
    @Column(name = "nh3_standard",precision = 10, scale = 2)
    private BigDecimal nh3Standard = new BigDecimal("0.01");

    // Ammonium (NH4^+), min = 0.20 mg/L, max = 2.00 mg/L
    @Column(name = "nh4_standard_min",precision = 10, scale = 2)
    private BigDecimal nh4StandardMin = new BigDecimal("0.20");

    @Column(name = "nh4_standard",precision = 10, scale = 2)
    private BigDecimal nh4Standard = new BigDecimal("2.00");


    @Column(name = "salt_03",precision = 10, scale = 2)
    private BigDecimal salt03; // Salt concentration - Minimum

    @Column(name = "salt_05",precision = 10, scale = 2)
    private BigDecimal salt05; // Salt concentration - Maximum

    @Column(name = "salt_07",precision = 10, scale = 2)
    private BigDecimal salt07; // Salt concentration - Maximum

    @Column(name = "ph_min", precision = 10, scale = 2)
    private BigDecimal phMin = new BigDecimal("7.00"); // pH tối thiểu

    @Column(name = "ph_max", precision = 10, scale = 2)
    private BigDecimal phMax = new BigDecimal("7.50"); // pH tối đa

    @Column(name = "temperature_min", precision = 10, scale = 2)
    private BigDecimal temperatureMin = new BigDecimal("20.00"); // Nhiệt độ tối thiểu

    @Column(name = "temperature_max", precision = 10, scale = 2)
    private BigDecimal temperatureMax = new BigDecimal("29.00"); // Nhiệt độ tối đa

    @Column(name = "carbonate_hardness_kh_min", precision = 10, scale = 2)
    private BigDecimal carbonateHardnessKhMin = new BigDecimal("90.00"); // KH tối thiểu (ppm)

    @Column(name = "carbonate_hardness_kh_max", precision = 10, scale = 2)
    private BigDecimal carbonateHardnessKhMax = new BigDecimal("120.00"); // KH tối đa (ppm)

    @Column(name = "general_hardness_gh_min", precision = 10, scale = 2)
    private BigDecimal generalHardnessGhMin = new BigDecimal("50.00"); // GH tối thiểu (ppm)

    @Column(name = "general_hardness_gh_max", precision = 10, scale = 2)
    private BigDecimal generalHardnessGhMax = new BigDecimal("200.00"); // GH tối đa (ppm)

    @Column(name = "oxygen_min", precision = 10, scale = 2)
    private BigDecimal oxygenMin = new BigDecimal("5.00"); // Oxy tối thiểu (mg/L)

    @Column(name = "oxygen_max", precision = 10, scale = 2)
    private BigDecimal oxygenMax = new BigDecimal("10.00"); // Oxy tối đa (mg/L)

    @Column(name = "amount_fed", precision = 10, scale = 2)
    private BigDecimal amountFedStandard;

    @Column(name = "chlorine_min", precision = 10, scale = 2)
    private BigDecimal chlorineMin; ;

    @Column(name = "chlorine_max", precision = 10, scale = 2)
    private BigDecimal chlorineMax; ;
    // Method to calculate values based on the volume from WaterParameter
    public void calculateValues(BigDecimal volume, List<KoiFish> koiFishs) {
        BigDecimal volumeInLiters = volume;
        if (volumeInLiters != null) {
            this.salt03 = new BigDecimal("0.003").multiply(volumeInLiters).setScale(2, RoundingMode.HALF_UP);
            this.salt05 = new BigDecimal("0.005").multiply(volumeInLiters).setScale(2, RoundingMode.HALF_UP);
            this.salt07 = new BigDecimal("0.007").multiply(volumeInLiters).setScale(2, RoundingMode.HALF_UP);
            this.chlorineMin = new BigDecimal("0.0001").multiply(volumeInLiters).setScale(2, RoundingMode.HALF_UP);
            this.chlorineMax = new BigDecimal("0.0003").multiply(volumeInLiters).setScale(2, RoundingMode.HALF_UP);
        }
        this.amountFedStandard = new BigDecimal("0.00");
        if (koiFishs != null) {
            for(KoiFish Koi : koiFishs){
                BigDecimal weight = Koi.getWeight();
                this.amountFedStandard = this.amountFedStandard.add(new BigDecimal("0.03").multiply(weight));
            }
            this.amountFedStandard = this.amountFedStandard.setScale(2, RoundingMode.HALF_UP);
        }
    }
}
