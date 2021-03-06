CREATE DATABASE olab;

\c olab

CREATE TABLE usuarios(
	correo VARCHAR(50) PRIMARY KEY,
	nombre VARCHAR (30) NOT NULL,
	apellido1 VARCHAR(30) NOT NULL,
	apellido2 VARCHAR(30),
	contrasenia VARCHAR(90) NOT NULL,
	celular INTEGER CHECK(celular >= 0),
	rol VARCHAR(15) NOT NULL,
	posicion VARCHAR(20),
	accesibilidad VARCHAR(30)
);

CREATE TABLE inventario(
	serial VARCHAR(20) PRIMARY KEY,
	placa VARCHAR(10) UNIQUE,
	nombre VARCHAR(30) NOT NULL,
	ubicacion VARCHAR(30),
	valor VARCHAR(20),
	cantidad REAL CHECK(cantidad >= 0) NOT NULL,
	unidad varchar(10),
	disponibles REAL CHECK(disponibles >= 0) NOT NULL,
	categoria VARCHAR(10),
	tipo VARCHAR(5)	NOT NULL
);

-- columna en_reserva es TRUE ('1') si los elementos aun no se han entregado (esta en reserva)
-- columna en_reserva es FALSE ('0') si los elementos ya se entregaron (no es reserva, ya es prestamo)

CREATE TABLE prestamo(
	prestamo_id VARCHAR(10) PRIMARY KEY,
	correo_usuario VARCHAR(50) NOT NULL,
	reserva DATE NOT NULL,
	entrega DATE NOT NULL,
	devolucion DATE NOT NULL,
	renovaciones SMALLINT NOT NULL CHECK(renovaciones >= 0),
	en_reserva BOOLEAN NOT NULL
);

CREATE TABLE prestamo_inv(
	prestamo_id VARCHAR(10),
	serial VARCHAR(20),
	cantidad REAL CHECK(cantidad >= 0),
	PRIMARY KEY(prestamo_id, serial),
	FOREIGN KEY(prestamo_id) REFERENCES prestamo(prestamo_id)
);

CREATE TABLE kits_inv(
	kit_id VARCHAR(10),
	serial VARCHAR(20),
	cantidad REAL NOT NULL CHECK(cantidad >= 0),	
	estado varchar(30),
	PRIMARY KEY(kit_id, serial)
);

CREATE TABLE politicas(
	categoria VARCHAR(30) PRIMARY KEY,
	horas_reserva NUMERIC DEFAULT 72,
	dias_prestamo NUMERIC DEFAULT 15,
	Max_renovaciones NUMERIC DEFAULT 5
);

ALTER TABLE usuarios
ADD CONSTRAINT fk_usuario_politica FOREIGN KEY(accesibilidad) REFERENCES politicas(categoria)
ON UPDATE CASCADE
ON DELETE SET NULL;

ALTER TABLE prestamo
ADD FOREIGN KEY(correo_usuario) REFERENCES usuarios(correo)
ON DELETE CASCADE;

ALTER TABLE prestamo_inv
ADD FOREIGN KEY(serial) REFERENCES inventario(serial)
ON DELETE CASCADE;

ALTER TABLE kits_inv
ADD FOREIGN KEY(kit_id) REFERENCES inventario(serial),
ADD FOREIGN KEY(serial) REFERENCES inventario(serial);

CREATE VIEW cliente_inventario AS
SELECT
	serial,
	placa,
	nombre,
	ubicacion,
	valor,
	unidad,
	categoria,
	tipo,
	CASE WHEN disponibles <= FLOOR(0.2*cantidad) THEN disponibles::TEXT WHEN disponibles <= FLOOR(0.6*cantidad) AND disponibles > FLOOR(0.2*cantidad) THEN 'media' ELSE 'disponible' END AS disponibles
FROM
	inventario;