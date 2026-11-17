package stagelink;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public final class Database {
    private static volatile boolean initialized;

    private Database() {}

    public static Connection open() throws SQLException {
        String url = System.getenv("JDBC_URL");
        if (url == null || url.isBlank()) {
            url = "jdbc:mysql://" + required("MYSQLHOST") + ":" + required("MYSQLPORT")
                    + "/" + required("MYSQLDATABASE")
                    + "?connectTimeout=5000&socketTimeout=10000";
        }
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException error) {
            throw new SQLException("No se encontró el controlador de MySQL.", error);
        }

        String password = System.getenv("MYSQLPASSWORD");
        if (password == null) {
            throw new SQLException("Falta MYSQLPASSWORD en el servidor.");
        }
        Connection connection = DriverManager.getConnection(url, required("MYSQLUSER"), password);
        try {
            if (!initialized) {
                initialize(connection);
            }
            return connection;
        } catch (SQLException error) {
            try {
                connection.close();
            } catch (SQLException closeError) {
                error.addSuppressed(closeError);
            }
            throw error;
        }
    }

    private static String required(String name) throws SQLException {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new SQLException("Falta " + name + " en el servidor.");
        }
        return value;
    }

    private static synchronized void initialize(Connection connection) throws SQLException {
        if (initialized) {
            return;
        }
        try (InputStream schema = Database.class.getResourceAsStream("/schema.sql");
             Statement statement = connection.createStatement()) {
            if (schema == null) {
                throw new SQLException("Falta el esquema de StageLink.");
            }
            String sql = new String(schema.readAllBytes(), StandardCharsets.UTF_8);
            for (String query : sql.split(";")) {
                if (!query.isBlank()) {
                    statement.executeUpdate(query.trim());
                }
            }
            ensureColumn(connection, statement, "audicion", "productora_id", "INT NULL");
            ensureColumn(connection, statement, "audicion", "publicada", "BOOLEAN NOT NULL DEFAULT TRUE");
            ensureColumn(connection, statement, "portafolio", "usuario_id", "INT NULL");
            ensureColumn(connection, statement, "notificacion", "usuario_id", "INT NULL");
            widenPasswordColumn(connection, statement);
            initialized = true;
        } catch (IOException error) {
            throw new SQLException("No se pudo leer el esquema de StageLink.", error);
        }
    }

    private static void ensureColumn(Connection connection, Statement statement,
                                     String table, String column, String definition) throws SQLException {
        boolean exists;
        try (ResultSet columns = connection.getMetaData().getColumns(connection.getCatalog(), null, table, column)) {
            exists = columns.next();
        }
        if (!exists) {
            statement.executeUpdate("ALTER TABLE " + table + " ADD COLUMN " + column + " " + definition);
        }
    }

    private static void widenPasswordColumn(Connection connection, Statement statement) throws SQLException {
        boolean tooShort;
        try (ResultSet columns = connection.getMetaData().getColumns(
                connection.getCatalog(), null, "usuario", "hash_contrasena")) {
            tooShort = columns.next() && columns.getInt("COLUMN_SIZE") < 255;
        }
        if (tooShort) {
            statement.executeUpdate("ALTER TABLE usuario MODIFY hash_contrasena VARCHAR(255)");
        }
    }
}
