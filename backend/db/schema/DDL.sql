CREATE TABLE usuario (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT false,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marca (
    marca_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_normal NUMERIC(10,2) NOT NULL,
    precio_oferta NUMERIC(10,2) NOT NULL,
    descuento INTEGER DEFAULT 0,
    marca_id INTEGER,
    stock INTEGER DEFAULT 0,
    disponibilidad VARCHAR(50),
    imagen_url TEXT,
    caracteristicas JSON,
    envio VARCHAR(200) DEFAULT 'Envío estándar',
    en_stock INTEGER DEFAULT 1,
    destacado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categoria (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE producto_categoria (
    producto_id INTEGER,
    categoria_id INTEGER,
    PRIMARY KEY (producto_id, categoria_id)
);

CREATE TABLE carrito (
    carrito_id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    estado VARCHAR(20)
);

CREATE TABLE carrito_producto (
    carrito_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    PRIMARY KEY (carrito_id, producto_id)
);

CREATE TABLE pedido (
    pedido_id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    fecha_pedido TIMESTAMP DEFAULT NOW(),
    total NUMERIC(10,2),
    descuento NUMERIC(10,2),
    estado_pedido VARCHAR(50)
);

CREATE TABLE pedido_producto (
    pedido_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER,
    precio_unitario NUMERIC(10,2),
    PRIMARY KEY (pedido_id, producto_id)
);

CREATE TABLE pago (
    pago_id SERIAL PRIMARY KEY,
    pedido_id INTEGER,
    metodo_pago VARCHAR(50),
    estado_pago VARCHAR(50),
    fecha_pago TIMESTAMP DEFAULT NOW(),
    monto NUMERIC(10,2)
);

CREATE TABLE envio (
    envio_id SERIAL PRIMARY KEY,
    pedido_id INTEGER,
    tipo_entrega VARCHAR(20),
    direccion_envio TEXT,
    sucursal_retiro TEXT,
    fecha_entrega_estimada DATE,
    costo NUMERIC(10,2),
    estado_envio VARCHAR(50)
);

CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_ventas (
    detalle_id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2)
);

-- Índices
CREATE INDEX idx_producto_marca_id ON producto (marca_id);
CREATE INDEX idx_carrito_usuario_id ON carrito (usuario_id);
CREATE INDEX idx_pedido_usuario_id ON pedido (usuario_id);
CREATE INDEX idx_envio_pedido_id ON envio (pedido_id);
CREATE INDEX idx_ventas_usuario_id ON ventas (usuario_id);
CREATE INDEX idx_detalle_ventas_venta_id ON detalle_ventas (venta_id);
CREATE INDEX idx_detalle_ventas_producto_id ON detalle_ventas (producto_id);
CREATE INDEX idx_producto_categoria_id ON producto_categoria (categoria_id);
CREATE INDEX idx_producto_destacado ON producto (destacado);
CREATE INDEX idx_producto_en_stock ON producto (en_stock);

-- Llaves foráneas
ALTER TABLE producto ADD FOREIGN KEY (marca_id) REFERENCES marca (marca_id);
ALTER TABLE producto_categoria ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
ALTER TABLE producto_categoria ADD FOREIGN KEY (categoria_id) REFERENCES categoria (categoria_id);
ALTER TABLE carrito ADD FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id);
ALTER TABLE carrito_producto ADD FOREIGN KEY (carrito_id) REFERENCES carrito (carrito_id);
ALTER TABLE carrito_producto ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
ALTER TABLE pedido ADD FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id);
ALTER TABLE pedido_producto ADD FOREIGN KEY (pedido_id) REFERENCES pedido (pedido_id);
ALTER TABLE pedido_producto ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
ALTER TABLE pago ADD FOREIGN KEY (pedido_id) REFERENCES pedido (pedido_id);
ALTER TABLE envio ADD FOREIGN KEY (pedido_id) REFERENCES pedido (pedido_id);
ALTER TABLE ventas ADD FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id);
ALTER TABLE detalle_ventas ADD FOREIGN KEY (venta_id) REFERENCES ventas (venta_id);
ALTER TABLE detalle_ventas ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
