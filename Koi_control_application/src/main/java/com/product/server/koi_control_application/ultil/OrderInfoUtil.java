package com.product.server.koi_control_application.ultil;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class OrderInfoUtil {
    private static final Pattern ORDER_ID_PATTERN = Pattern.compile("OrderId: (\\d+)");

    public Optional<Integer> extractOrderId(String orderInfo) {
        Matcher matcher = ORDER_ID_PATTERN.matcher(orderInfo);
        if (matcher.find()) {
            return Optional.of(Integer.parseInt(matcher.group(1)));
        }
        return Optional.empty();
    }
}