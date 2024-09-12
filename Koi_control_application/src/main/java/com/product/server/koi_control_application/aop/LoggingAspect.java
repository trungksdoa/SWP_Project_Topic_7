package com.product.server.koi_control_application.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Around("execution(* com.product.server.koi_control_application.service.*.*(..)) || " +
            "execution(* com.product.server.koi_control_application.controller.*.*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String className = methodSignature.getDeclaringType().getSimpleName();
        String methodName = methodSignature.getName();

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.info("=== START: {}::{} ===", className, methodName);
        logger.info("Timestamp: {}", LocalDateTime.now().format(DATE_TIME_FORMATTER));
        logger.info("Arguments: {}", Arrays.toString(joinPoint.getArgs()));

        Object result;
        try {
            result = joinPoint.proceed();
            stopWatch.stop();
            logger.info("Execution completed in {}ms", stopWatch.getTotalTimeMillis());
            logger.info("Return Value: {}", result);
        } catch (Exception e) {
            logger.error("Exception occurred: {}", e.getMessage(), e);
            throw e;
        } finally {
            logger.info("=== END: {}::{} ===", className, methodName);
        }

        return result;
    }
}