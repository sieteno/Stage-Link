CREATE TABLE IF NOT EXISTS usuario (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    correo VARCHAR(254) NOT NULL UNIQUE,
    hash_contrasena VARCHAR(255) NOT NULL,
    ciudad VARCHAR(120),
    biografia TEXT,
    telefono VARCHAR(40)
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS audicion (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productora_id INT,
    titulo VARCHAR(200) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo_compensacion VARCHAR(40),
    detalle_pago VARCHAR(255),
    requisitos TEXT,
    lugar VARCHAR(255),
    distrito VARCHAR(120),
    fecha_limite DATE,
    fecha_audicion DATE,
    hora TIME,
    publicada BOOLEAN NOT NULL DEFAULT TRUE
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS portafolio (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo_material VARCHAR(50) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    etiquetas VARCHAR(255),
    enlace_externo VARCHAR(2048)
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS notificacion (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN NOT NULL DEFAULT FALSE
) DEFAULT CHARACTER SET utf8mb4;
