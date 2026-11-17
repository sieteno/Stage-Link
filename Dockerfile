FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml ./
COPY src/ ./src/
RUN mvn --batch-mode --no-transfer-progress package

FROM tomcat:9.0-jre21-temurin
ENV CATALINA_OPTS="-Xms32m -Xmx256m -XX:+ExitOnOutOfMemoryError"
COPY --from=build /build/target/Stage-Link.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
