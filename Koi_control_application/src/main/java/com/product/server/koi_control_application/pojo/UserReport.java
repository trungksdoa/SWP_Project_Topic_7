package com.product.server.koi_control_application.pojo;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserReport {
    private String date;
    private int newUsers;

    public UserReport(String date, long newUsers) {
        this.date = date;
        this.newUsers = (int) newUsers;
    }
}
