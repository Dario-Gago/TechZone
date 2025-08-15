CREATE TABLE usuario (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    admin BOOLEAN NOT NULL DEFAULT false,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    descripcion TEXT,
    precio_original DECIMAL(10,2) NOT NULL,
    precio_descuento DECIMAL(10,2) NOT NULL,
    descuento INTEGER DEFAULT 0,
    imagen VARCHAR(500),
    caracteristicas JSONB,
    categoria VARCHAR(100),
    subcategoria VARCHAR(100),
    envio VARCHAR(200) DEFAULT 'Envío estándar',
    en_stock INTEGER DEFAULT 1,
    stock INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
