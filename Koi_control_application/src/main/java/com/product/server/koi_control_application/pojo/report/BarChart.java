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
    private LocalDateTime date;


    public BarChart(Object label, Long count, LocalDateTime date) {
        this.label = label;
        this.count = count;
        this.date = date;
    }

}