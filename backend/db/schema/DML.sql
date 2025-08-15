INSERT INTO usuario (nombre, email, password_hash, admin) VALUES
-- Contraseña: pass1234
('Admin User', 'admin@techzone.com', '$2a$12$7xKLNvtlJQJhGrC5X1ZjOeN3YoFcZGYW5kJ2lT8mR9qP7nE4vL6dK', true),
('Usuario Regular', 'usuario@techzone.com', '$2a$12$7xKLNvtlJQJhGrC5X1ZjOeN3YoFcZGYW5kJ2lT8mR9qP7nE4vL6dK', false);

INSERT INTO productos (
    id, nombre, marca, descripcion, precio_original, precio_descuento, descuento,
    imagen, caracteristicas, categoria, subcategoria, envio, en_stock, stock, destacado
) VALUES
(1, 'GeForce RTX 5060 OC, 8GB 128-bit, PCI-e 5.0 x8', 'GIGABYTE',
 'Tarjeta gráfica de alto rendimiento para gaming y streaming profesional. Perfecta para juegos en 1440p con ray tracing.',
 499999.00, 389990.00, 20,
 'https://media.solotodo.com/media/products/2096221_picture_1750156278.png',
 '["Arquitectura NVIDIA Ada Lovelace", "8GB GDDR6X de memoria de video", "Ray Tracing de 3ra generación", "DLSS 3 con Frame Generation", "Diseño con triple ventilador"]',
 'componentes', 'tarjetas-graficas', 'Envío en 3 - 4 días', 1, 15, true),

(2, 'Prime Radeon RX 9070 XT OC, 16GB GDDR6', 'ASUS',
 'Potente tarjeta gráfica AMD con 16GB de memoria para gaming en 4K y creación de contenido profesional.',
 699999.00, 559990.00, 20,
 'https://media.solotodo.com/media/products/2087610_picture_1747988354.jpg',
 '["Arquitectura RDNA 4", "16GB GDDR6", "Ray Tracing acelerado", "AMD FidelityFX Super Resolution", "Cold triple-fan cooling"]',
 'componentes', 'tarjetas-graficas', 'Envío en 3 - 4 días', 1, 5, true),

(3, 'Intel Arc B580, 12GB GDDR6', 'Intel',
 'Opción económica para gaming 1440p con buena estabilidad de drivers.',
 249990.00, 229990.00, 8,
 'https://media.solotodo.com/media/products/2106948_picture_1752788462.png',
 '["12GB GDDR6", "≈92 FPS promedio en 1440p", "Soporte básico para Ray Tracing"]',
 'componentes', 'tarjetas-graficas', 'Envío en 2 - 3 días', 1, 20, false),

(4, 'NVIDIA RTX 5070 Ti, 16GB GDDR7', 'NVIDIA',
 'GPU de gama alta para gaming 4K y tareas creativas exigentes.',
 749999.00, 679990.00, 9,
 'https://media.solotodo.com/media/products/2021143_picture_1740499761.png',
 '["16GB GDDR7", "DLSS 4 y Frame Generation", "Ray Tracing generación 4"]',
 'componentes', 'tarjetas-graficas', 'Envío en 3 - 5 días', 1, 5, true),

(5, 'ASUS RTX 5090, 32GB GDDR7', 'NVIDIA',
 'Tope de gama para IA y creación profesional con VRAM masiva.',
 1599999.00, 1499990.00, 6,
 'https://media.solotodo.com/media/products/2045141_picture_1742547900.png',
 '["32GB GDDR7", "DLSS 4", "Ray Tracing top-tier", "PCIe 5.0"]',
 'componentes', 'tarjetas-graficas', 'Envío en 3 - 5 días', 1, 2, true),

(6, 'Procesador Intel Core i7-13700K', 'Intel',
 'Procesador de alto rendimiento con 16 núcleos para gaming y creación de contenido.',
 599999.00, 479990.00, 20,
 'https://media.solotodo.com/media/products/1648741_picture_1664520596.jpg',
 '["16 núcleos (8P + 8E)", "Boost hasta 5.4GHz", "Socket LGA1700"]',
 'componentes', 'procesadores', 'Envío en 2 - 3 días', 1, 10, true);

