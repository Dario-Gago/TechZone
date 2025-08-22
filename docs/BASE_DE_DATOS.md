# 🗄️ Base de Datos - TechZone

## 📋 Índice
1. [Diseño de la Base de Datos](#diseño-de-la-base-de-datos)
2. [Esquema Relacional](#esquema-relacional)
3. [Tablas y Estructuras](#tablas-y-estructuras)
4. [Relaciones y Claves Foráneas](#relaciones-y-claves-foráneas)
5. [Índices y Optimización](#índices-y-optimización)
6. [Datos de Prueba](#datos-de-prueba)
7. [Consultas Comunes](#consultas-comunes)
8. [Migraciones y Versionado](#migraciones-y-versionado)

## 🎯 Diseño de la Base de Datos

### Características Principales
- **Motor**: PostgreSQL 12+
- **Normalización**: Tercera Forma Normal (3NF)
- **Integridad**: Constraints y triggers
- **Performance**: Índices optimizados
- **Escalabilidad**: Diseño modular y extensible

### Principios de Diseño
- **Atomicidad**: Cada campo contiene un valor único
- **Consistencia**: Reglas de negocio aplicadas a nivel DB
- **Aislamiento**: Transacciones seguras
- **Durabilidad**: Persistencia garantizada

## 🏗️ Esquema Relacional

```sql
-- Diagrama de Relaciones (Texto)
usuario (1) -----> (N) carrito
usuario (1) -----> (N) pedido
usuario (1) -----> (N) ventas

producto (N) <----> (N) categoria [producto_categoria]
producto (N) -----> (1) marca
producto (1) -----> (N) carrito_producto
producto (1) -----> (N) pedido_producto
producto (1) -----> (N) detalle_ventas

ventas (1) -----> (N) detalle_ventas
pedido (1) -----> (N) pedido_producto
pedido (1) -----> (1) pago
pedido (1) -----> (1) envio

carrito (1) -----> (N) carrito_producto
```

### Entidades Core del Sistema

#### 1. **Gestión de Usuarios**
- `usuario` - Información de usuarios y administradores

#### 2. **Catálogo de Productos**
- `producto` - Información detallada de productos
- `marca` - Marcas de productos tecnológicos
- `categoria` - Categorías de productos
- `producto_categoria` - Relación N:M entre productos y categorías

#### 3. **Sistema de Comercio**
- `carrito` - Carritos de compra de usuarios
- `carrito_producto` - Items en cada carrito
- `pedido` - Órdenes de compra procesadas
- `pedido_producto` - Productos en cada pedido
- `ventas` - Registro de ventas completadas
- `detalle_ventas` - Detalle de productos vendidos

#### 4. **Gestión de Pagos y Envíos**
- `pago` - Información de pagos procesados
- `envio` - Datos de envío y entrega

## 📊 Tablas y Estructuras

### Tabla: `usuario`
```sql
CREATE TABLE usuario (
    usuario_id SERIAL PRIMARY KEY,              -- ID único autoincrementable
    nombre VARCHAR(100) NOT NULL,               -- Nombre completo del usuario
    admin BOOLEAN NOT NULL DEFAULT false,       -- Flag de administrador
    email VARCHAR(100) UNIQUE NOT NULL,         -- Email único para login
    password_hash TEXT NOT NULL,                -- Hash bcrypt de la contraseña
    telefono VARCHAR(20),                       -- Teléfono de contacto
    direccion TEXT,                             -- Dirección de envío
    fecha_registro TIMESTAMP DEFAULT NOW()      -- Timestamp de registro
);
```

**Campos Importantes:**
- `admin`: Determina permisos de administración
- `email`: Clave única para autenticación
- `password_hash`: Nunca almacena contraseñas en texto plano
- `fecha_registro`: Auditoría de creación de cuenta

### Tabla: `producto`
```sql
CREATE TABLE producto (
    producto_id SERIAL PRIMARY KEY,             -- ID único del producto
    nombre VARCHAR(255) NOT NULL,               -- Nombre del producto
    descripcion TEXT,                           -- Descripción detallada
    precio_normal NUMERIC(10,2) NOT NULL,       -- Precio regular
    precio_oferta NUMERIC(10,2) NOT NULL,       -- Precio con descuento
    descuento INTEGER DEFAULT 0,                -- Porcentaje de descuento
    marca_id INTEGER,                           -- FK a tabla marca
    stock INTEGER DEFAULT 0,                    -- Cantidad en inventario
    disponibilidad VARCHAR(50),                 -- Estado de disponibilidad
    imagen_url TEXT,                            -- URL de imagen principal
    caracteristicas JSON,                       -- Especificaciones técnicas
    envio VARCHAR(200) DEFAULT 'Envío estándar',-- Tipo de envío disponible
    en_stock INTEGER DEFAULT 1,                 -- Flag de disponibilidad (0/1)
    destacado BOOLEAN DEFAULT false,            -- Producto destacado en home
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Campos Especiales:**
- `caracteristicas JSON`: Almacena especificaciones técnicas flexibles
- `precio_oferta`: Siempre se muestra, puede ser igual al precio normal
- `destacado`: Flag para productos en carousel principal
- `en_stock`: Control rápido de disponibilidad

### Tabla: `marca`
```sql
CREATE TABLE marca (
    marca_id SERIAL PRIMARY KEY,                -- ID único de marca
    nombre VARCHAR(100) NOT NULL                -- Nombre de la marca
);
```

### Tabla: `categoria`
```sql
CREATE TABLE categoria (
    categoria_id SERIAL PRIMARY KEY,            -- ID único de categoría
    nombre VARCHAR(100) NOT NULL,               -- Nombre de la categoría
    activo BOOLEAN DEFAULT TRUE                 -- Flag de categoría activa
);
```

### Tabla: `producto_categoria` (Relación N:M)
```sql
CREATE TABLE producto_categoria (
    producto_id INTEGER,                        -- FK a producto
    categoria_id INTEGER,                       -- FK a categoria
    PRIMARY KEY (producto_id, categoria_id)     -- Clave compuesta
);
```

### Tabla: `ventas`
```sql
CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,                -- ID único de venta
    usuario_id INTEGER NOT NULL,                -- FK a usuario comprador
    total NUMERIC(10,2) NOT NULL,               -- Total de la venta
    estado VARCHAR(50) DEFAULT 'pendiente',     -- Estado de la venta
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp de venta
);
```

### Tabla: `detalle_ventas`
```sql
CREATE TABLE detalle_ventas (
    detalle_id SERIAL PRIMARY KEY,              -- ID único del detalle
    venta_id INTEGER NOT NULL,                  -- FK a venta
    producto_id INTEGER NOT NULL,               -- FK a producto
    cantidad INTEGER NOT NULL,                  -- Cantidad comprada
    precio_unitario NUMERIC(10,2) NOT NULL,     -- Precio al momento de venta
    subtotal NUMERIC(10,2)                      -- cantidad * precio_unitario
);
```

### Tabla: `carrito`
```sql
CREATE TABLE carrito (
    carrito_id SERIAL PRIMARY KEY,              -- ID único del carrito
    usuario_id INTEGER,                         -- FK a usuario propietario
    fecha_creacion TIMESTAMP DEFAULT NOW(),     -- Timestamp de creación
    estado VARCHAR(20)                          -- Estado del carrito
);
```

### Tabla: `carrito_producto`
```sql
CREATE TABLE carrito_producto (
    carrito_id INTEGER,                         -- FK a carrito
    producto_id INTEGER,                        -- FK a producto
    cantidad INTEGER,                           -- Cantidad en carrito
    PRIMARY KEY (carrito_id, producto_id)       -- Clave compuesta
);
```

## 🔗 Relaciones y Claves Foráneas

### Relaciones Implementadas

#### 1. **Usuario → Ventas (1:N)**
```sql
ALTER TABLE ventas ADD FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id);
```
- Un usuario puede tener múltiples ventas
- Cada venta pertenece a un único usuario

#### 2. **Producto → Marca (N:1)**
```sql
ALTER TABLE producto ADD FOREIGN KEY (marca_id) REFERENCES marca (marca_id);
```
- Múltiples productos pueden tener la misma marca
- Cada producto tiene una marca opcional

#### 3. **Producto ↔ Categoría (N:M)**
```sql
ALTER TABLE producto_categoria ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
ALTER TABLE producto_categoria ADD FOREIGN KEY (categoria_id) REFERENCES categoria (categoria_id);
```
- Un producto puede estar en múltiples categorías
- Una categoría puede contener múltiples productos

#### 4. **Venta → Detalle Ventas (1:N)**
```sql
ALTER TABLE detalle_ventas ADD FOREIGN KEY (venta_id) REFERENCES ventas (venta_id);
ALTER TABLE detalle_ventas ADD FOREIGN KEY (producto_id) REFERENCES producto (producto_id);
```
- Una venta puede tener múltiples productos
- Cada detalle pertenece a una única venta

### Integridad Referencial
```sql
-- Ejemplo de constraint personalizado
ALTER TABLE producto ADD CONSTRAINT check_precio_positivo 
    CHECK (precio_normal > 0 AND precio_oferta > 0);

ALTER TABLE detalle_ventas ADD CONSTRAINT check_cantidad_positiva 
    CHECK (cantidad > 0);

ALTER TABLE usuario ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

## ⚡ Índices y Optimización

### Índices Primarios (Automáticos)
```sql
-- Creados automáticamente con PRIMARY KEY
CREATE UNIQUE INDEX usuario_pkey ON usuario (usuario_id);
CREATE UNIQUE INDEX producto_pkey ON producto (producto_id);
-- ... más índices primarios
```

### Índices Secundarios (Performance)
```sql
-- Búsquedas por email (login frecuente)
CREATE UNIQUE INDEX idx_usuario_email ON usuario (email);

-- Búsquedas de productos por marca
CREATE INDEX idx_producto_marca_id ON producto (marca_id);

-- Productos destacados (home page)
CREATE INDEX idx_producto_destacado ON producto (destacado) WHERE destacado = true;

-- Productos en stock (filtros de disponibilidad)
CREATE INDEX idx_producto_en_stock ON producto (en_stock) WHERE en_stock = 1;

-- Ventas por usuario (historial de compras)
CREATE INDEX idx_ventas_usuario_id ON ventas (usuario_id);

-- Detalles de venta por producto (reportes)
CREATE INDEX idx_detalle_ventas_producto_id ON detalle_ventas (producto_id);

-- Categorías de productos (navegación)
CREATE INDEX idx_producto_categoria_categoria_id ON producto_categoria (categoria_id);

-- Carritos activos por usuario
CREATE INDEX idx_carrito_usuario_id ON carrito (usuario_id);

-- Búsquedas por fecha de venta
CREATE INDEX idx_ventas_fecha_venta ON ventas (fecha_venta);
```

### Índices Compuestos (Consultas Complejas)
```sql
-- Productos disponibles con precio (página de productos)
CREATE INDEX idx_producto_disponible_precio ON producto (en_stock, precio_oferta) 
    WHERE en_stock = 1;

-- Ventas por usuario y fecha (reportes de usuario)
CREATE INDEX idx_ventas_usuario_fecha ON ventas (usuario_id, fecha_venta);

-- Productos por categoría y disponibilidad
CREATE INDEX idx_prod_cat_disponible ON producto_categoria (categoria_id) 
    INCLUDE (producto_id) WHERE EXISTS (
        SELECT 1 FROM producto p WHERE p.producto_id = producto_categoria.producto_id AND p.en_stock = 1
    );
```

### Optimización de Consultas

#### Análisis de Performance
```sql
-- Explicar plan de consulta
EXPLAIN ANALYZE SELECT p.nombre, p.precio_oferta, m.nombre as marca
FROM producto p
JOIN marca m ON p.marca_id = m.marca_id
WHERE p.en_stock = 1 AND p.precio_oferta BETWEEN 100 AND 500
ORDER BY p.destacado DESC, p.precio_oferta ASC;
```

#### Estadísticas de Tablas
```sql
-- Actualizar estadísticas para optimizador
ANALYZE producto;
ANALYZE ventas;
ANALYZE detalle_ventas;

-- Ver estadísticas de uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 📋 Datos de Prueba

### Marcas Tecnológicas
```sql
INSERT INTO marca (nombre) VALUES 
('NVIDIA'), ('AMD'), ('Intel'), ('ASUS'), ('MSI'), 
('Corsair'), ('Logitech'), ('Samsung'), ('Kingston'), ('Seagate');
```

### Categorías de Productos
```sql
INSERT INTO categoria (nombre, activo) VALUES 
('Tarjetas Gráficas', true),
('Procesadores', true),
('Memoria RAM', true),
('Almacenamiento', true),
('Placas Madre', true),
('Periféricos', true),
('Gaming', true),
('Monitores', true);
```

### Usuarios de Ejemplo
```sql
-- Usuario administrador
INSERT INTO usuario (nombre, admin, email, password_hash, telefono, direccion) VALUES 
('Administrador', true, 'admin@techzone.com', '$2a$10$hashedpassword...', '555-0001', 'Oficina Central');

-- Usuarios regulares
INSERT INTO usuario (nombre, admin, email, password_hash, telefono, direccion) VALUES 
('Juan Pérez', false, 'juan@email.com', '$2a$10$hashedpassword...', '555-0101', 'Av. Principal 123'),
('María González', false, 'maria@email.com', '$2a$10$hashedpassword...', '555-0102', 'Calle Secundaria 456'),
('Carlos López', false, 'carlos@email.com', '$2a$10$hashedpassword...', '555-0103', 'Plaza Central 789');
```

### Productos Tecnológicos
```sql
-- Ejemplo de producto con características JSON
INSERT INTO producto (
    nombre, descripcion, precio_normal, precio_oferta, descuento, 
    marca_id, stock, disponibilidad, imagen_url, caracteristicas, 
    en_stock, destacado
) VALUES (
    'NVIDIA RTX 4070 Ti', 
    'Tarjeta gráfica de alto rendimiento para gaming y creación de contenido',
    899.99, 849.99, 6,
    1, -- NVIDIA
    15, 'En Stock', 
    '/images/rtx4070ti.jpg',
    '{
        "memoria": "12GB GDDR6X",
        "memoria_bus": "192-bit",
        "base_clock": "1920 MHz",
        "boost_clock": "2610 MHz",
        "cuda_cores": "7680",
        "ray_tracing": "3rd Gen RT Cores",
        "dlss": "DLSS 3",
        "potencia": "285W",
        "conectores": ["3x DisplayPort 1.4a", "1x HDMI 2.1a"],
        "dimensiones": "336mm x 140mm x 61mm"
    }'::json,
    1, true
);
```

## 🔍 Consultas Comunes

### 1. Obtener Productos con Marca y Categorías
```sql
SELECT 
    p.producto_id,
    p.nombre,
    p.precio_oferta,
    p.descuento,
    m.nombre as marca,
    array_agg(c.nombre) as categorias,
    p.caracteristicas,
    p.stock
FROM producto p
LEFT JOIN marca m ON p.marca_id = m.marca_id
LEFT JOIN producto_categoria pc ON p.producto_id = pc.producto_id
LEFT JOIN categoria c ON pc.categoria_id = c.categoria_id
WHERE p.en_stock = 1
GROUP BY p.producto_id, m.nombre
ORDER BY p.destacado DESC, p.precio_oferta ASC;
```

### 2. Historial de Compras de Usuario
```sql
SELECT 
    v.venta_id,
    v.fecha_venta,
    v.total,
    v.estado,
    json_agg(
        json_build_object(
            'producto', p.nombre,
            'cantidad', dv.cantidad,
            'precio_unitario', dv.precio_unitario,
            'subtotal', dv.subtotal
        )
    ) as productos
FROM ventas v
JOIN detalle_ventas dv ON v.venta_id = dv.venta_id
JOIN producto p ON dv.producto_id = p.producto_id
WHERE v.usuario_id = $1
GROUP BY v.venta_id, v.fecha_venta, v.total, v.estado
ORDER BY v.fecha_venta DESC;
```

### 3. Productos Más Vendidos
```sql
SELECT 
    p.nombre,
    p.precio_oferta,
    m.nombre as marca,
    SUM(dv.cantidad) as total_vendido,
    SUM(dv.subtotal) as ingresos_totales,
    COUNT(DISTINCT dv.venta_id) as numero_ventas
FROM detalle_ventas dv
JOIN producto p ON dv.producto_id = p.producto_id
LEFT JOIN marca m ON p.marca_id = m.marca_id
JOIN ventas v ON dv.venta_id = v.venta_id
WHERE v.fecha_venta >= NOW() - INTERVAL '30 days'
GROUP BY p.producto_id, p.nombre, p.precio_oferta, m.nombre
ORDER BY total_vendido DESC
LIMIT 10;
```

### 4. Carrito Actual del Usuario
```sql
SELECT 
    cp.cantidad,
    p.producto_id,
    p.nombre,
    p.precio_oferta,
    p.imagen_url,
    p.stock,
    (cp.cantidad * p.precio_oferta) as subtotal
FROM carrito c
JOIN carrito_producto cp ON c.carrito_id = cp.carrito_id
JOIN producto p ON cp.producto_id = p.producto_id
WHERE c.usuario_id = $1 AND c.estado = 'activo'
ORDER BY p.nombre;
```

### 5. Reporte de Ventas por Período
```sql
SELECT 
    DATE(v.fecha_venta) as fecha,
    COUNT(v.venta_id) as numero_ventas,
    SUM(v.total) as ingresos_dia,
    AVG(v.total) as ticket_promedio,
    COUNT(DISTINCT v.usuario_id) as clientes_unicos
FROM ventas v
WHERE v.fecha_venta >= $1 AND v.fecha_venta <= $2
GROUP BY DATE(v.fecha_venta)
ORDER BY fecha DESC;
```

## 🔄 Migraciones y Versionado

### Script DDL (Data Definition Language)
```sql
-- backend/db/schema/DDL.sql
-- Contiene toda la estructura de tablas, índices y constraints
-- Se ejecuta una sola vez para crear la estructura inicial
```

### Script DML (Data Manipulation Language)
```sql
-- backend/db/schema/DML.sql
-- Contiene datos iniciales y de prueba
-- Marcas, categorías, productos de ejemplo, usuario admin
```

### Versionado de Schema
```sql
-- Tabla para tracking de migraciones
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Registro de migración aplicada
INSERT INTO schema_migrations (version, description) VALUES 
('001_initial_schema', 'Estructura inicial de base de datos'),
('002_add_caracteristicas_json', 'Agregar campo JSON para características'),
('003_add_indexes_performance', 'Índices para optimización de performance');
```

### Backup y Restauración
```bash
# Backup completo
pg_dump techzone_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup solo estructura
pg_dump --schema-only techzone_db > structure_backup.sql

# Backup solo datos
pg_dump --data-only techzone_db > data_backup.sql

# Restauración
psql -d techzone_db < backup_file.sql
```

### Monitoreo de Performance
```sql
-- Consultas lentas
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan < 100
ORDER BY idx_scan;

-- Tamaño de tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

*Esta base de datos está diseñada para soportar un e-commerce completo con escalabilidad, performance y integridad de datos como prioridades principales.*
