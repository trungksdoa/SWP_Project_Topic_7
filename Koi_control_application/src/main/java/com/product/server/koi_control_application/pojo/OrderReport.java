package com.product.server.koi_control_application.pojo;



import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderReport {
    private String label;
    private int value;

    public OrderReport(String label, long value) {
        this.label = label;
        this.value = (int) value;
    }
}
