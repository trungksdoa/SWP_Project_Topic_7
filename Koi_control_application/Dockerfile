# Build stage
FROM gradle:7.6.1-jdk17 AS build
WORKDIR /workspace/app

COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /workspace/app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]