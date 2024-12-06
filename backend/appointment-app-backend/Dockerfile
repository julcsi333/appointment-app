FROM gradle:latest AS BUILD
WORKDIR /app
COPY . .
RUN gradle build -x test 

FROM openjdk:21-jdk-slim
ENV JAR_NAME=appointment-app-backend-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/app
WORKDIR $APP_HOME
COPY --from=BUILD $APP_HOME .

EXPOSE 8080

ENTRYPOINT exec java -jar $APP_HOME/build/libs/$JAR_NAME
