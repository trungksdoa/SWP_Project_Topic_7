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

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Around("execution(* com.product.server.koi_control_application.service.*.*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        String className = methodSignature.getDeclaringType().getSimpleName();
        String methodName = methodSignature.getName();
        Object[] args = joinPoint.getArgs();

        final StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.info("=== START ===");
        logger.info("Timestamp: {}", LocalDateTime.now().format(dateTimeFormatter));
        logger.info("Class: {}", className);
        logger.info("Method: {}", methodName);
        logger.info("Arguments: {}", args);

        Object result;
        try {
            result = joinPoint.proceed();
            stopWatch.stop();
            logger.info("Execution of {}::{} completed in {}ms", className, methodName, stopWatch.getTotalTimeMillis());
            logger.info("Return Value: {}", result);
        } catch (Exception e) {
            logger.error("Exception in {}::{}: {}", className, methodName, e.getMessage());
            throw e;
        } finally {
            logger.info("=== END ===");
        }

        return result;
    }
}
