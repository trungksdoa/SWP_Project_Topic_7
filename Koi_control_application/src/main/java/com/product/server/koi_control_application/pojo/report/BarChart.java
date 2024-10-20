package com.product.server.koi_control_application.pojo.report;


import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BarChart {
    private Object label;
    private Long count;

    public BarChart(Object label, Long count) {
        this.label = label;
        this.count = count;
    }
}