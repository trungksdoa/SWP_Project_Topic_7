# Build stage
FROM gradle:7.6.1-jdk17 AS build
WORKDIR /workspace/app

COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

# Kiểm tra nội dung JAR
RUN jar tf build/libs/*.jar | grep KoiControlApplication.class

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /workspace/app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-verbose:class", "-jar", "app.jar"]