-- Insertar usuarios iniciales
INSERT INTO usuario (nombre, email, password_hash, admin) VALUES
-- Contraseña: pass1234
('Admin User', 'admin@techzone.com', '$2a$12$7xKLNvtlJQJhGrC5X1ZjOeN3YoFcZGYW5kJ2lT8mR9qP7nE4vL6dK', true),
('Usuario Regular', 'usuario@techzone.com', '$2a$12$7xKLNvtlJQJhGrC5X1ZjOeN3YoFcZGYW5kJ2lT8mR9qP7nE4vL6dK', false);

-- Insertar marcas
INSERT INTO marca (nombre) VALUES
('GIGABYTE'),
('ASUS'),
('Intel'),
('NVIDIA'),
('AMD'),
('MSI'),
('EVGA'),
('Netgear'),
('GL-iNet'),
('Shure'),
('Logitech'),
('Elgato'),
('HyperX'),
('Rode'),
('Lenovo'),
('Dell'),
('HP'),
('Framework'),
('Philips'),
('Amazon'),
('Google'),
('Ring'),
('IKEA'),
('Sony'),
('Bowers & Wilkins'),
('JBL'),
('Klipsch'),
('Victrola'),
('Samsung'),
('Apple'),
('Xiaomi'),
('Microsoft'),
('Anker'),
('Peak Design'),
('Moment'),
('Belkin'),
('SanDisk');

-- Insertar categorías (orden según frontend)
INSERT INTO categoria (nombre, activo) VALUES
('gaming-streaming', true),
('computacion', true),
('componentes', true),
('conectividad-redes', true),
('hogar-oficina', true),
('audio-video', true),
('otras-categorias', true);

-- Insertar productos
INSERT INTO producto (
    nombre, descripcion, precio_normal, precio_oferta, descuento, marca_id,
    stock, disponibilidad, imagen_url, caracteristicas, envio, en_stock, destacado
) VALUES
-- Tarjetas Gráficas
('GeForce RTX 5060 OC, 8GB 128-bit, PCI-e 5.0 x8', 
 'Tarjeta gráfica de alto rendimiento para gaming y streaming profesional. Perfecta para juegos en 1440p con ray tracing.',
 499999.00, 389990.00, 20, 1, 15, 'disponible', 
 'https://media.solotodo.com/media/products/2096221_picture_1750156278.png',
 '{"arquitectura": "NVIDIA Ada Lovelace", "memoria": "8GB GDDR6X", "ray_tracing": "3ra generación", "dlss": "DLSS 3 con Frame Generation", "enfriamiento": "Triple ventilador"}',
 'Envío en 3 - 4 días', 1, true),

('Prime Radeon RX 9070 XT OC, 16GB GDDR6',
 'Potente tarjeta gráfica AMD con 16GB de memoria para gaming en 4K y creación de contenido profesional.',
 699999.00, 559990.00, 20, 2, 5, 'disponible', 
 'https://media.solotodo.com/media/products/2087610_picture_1747988354.jpg',
 '{"arquitectura": "RDNA 4", "memoria": "16GB GDDR6", "ray_tracing": "Acelerado", "fsr": "AMD FidelityFX Super Resolution", "enfriamiento": "Cold triple-fan cooling"}',
 'Envío en 3 - 4 días', 1, true),

('Intel Arc B580, 12GB GDDR6',
 'Opción económica para gaming 1440p con buena estabilidad de drivers.',
 249990.00, 229990.00, 8, 3, 20, 'disponible', 
 'https://media.solotodo.com/media/products/2106948_picture_1752788462.png',
 '{"memoria": "12GB GDDR6", "rendimiento": "≈92 FPS promedio en 1440p", "ray_tracing": "Soporte básico"}',
 'Envío en 2 - 3 días', 1, false),

('NVIDIA RTX 5070 Ti, 16GB GDDR7',
 'GPU de gama alta para gaming 4K y tareas creativas exigentes.',
 749999.00, 679990.00, 9, 4, 5, 'disponible', 
 'https://media.solotodo.com/media/products/2021143_picture_1740499761.png',
 '{"memoria": "16GB GDDR7", "dlss": "DLSS 4 y Frame Generation", "ray_tracing": "Generación 4"}',
 'Envío en 3 - 5 días', 1, true),

('ASUS RTX 5090, 32GB GDDR7',
 'Tope de gama para IA y creación profesional con VRAM masiva.',
 1599999.00, 1499990.00, 6, 4, 2, 'disponible', 
 'https://media.solotodo.com/media/products/2045141_picture_1742547900.png',
 '{"memoria": "32GB GDDR7", "dlss": "DLSS 4", "ray_tracing": "Top-tier", "interface": "PCIe 5.0"}',
 'Envío en 3 - 5 días', 1, true),

-- Procesadores
('Procesador Intel Core i7-13700K',
 'Procesador de alto rendimiento con 16 núcleos para gaming y creación de contenido.',
 599999.00, 479990.00, 20, 3, 10, 'disponible', 
 'https://media.solotodo.com/media/products/1648741_picture_1664520596.jpg',
 '{"nucleos": "16 núcleos (8P + 8E)", "boost": "Hasta 5.4GHz", "socket": "LGA1700"}',
 'Envío en 2 - 3 días', 1, true),

('AMD Ryzen 7 7800X3D, 3D-VCache',
 'CPU con caché 3D para bajo retardo en juegos muy exigentes.',
 449999.00, 399990.00, 11, 5, 10, 'disponible', 
 'https://media.solotodo.com/media/products/1754039_picture_1682576193.jpg',
 '{"nucleos": "8 núcleos Zen 4 + 3D V-Cache", "soporte": "DDR5 / PCIe 5.0", "boost": "Alta frecuencia boost"}',
 'Envío en 2 - 3 días', 1, false),

-- Conectividad y Redes
('ASUS ZenWiFi BT10 Wi-Fi 7 Mesh',
 'Sistema mesh Wi-Fi 7 con excelente cobertura y rendimiento para hogar/oficina.',
 349990.00, 319990.00, 9, 2, 7, 'disponible', 
 'https://dlcdnwebimgs.asus.com/gain/dd0f2f91-cdef-4e8b-85d9-e92fd5f32d39/w692',
 '{"banda": "Tri-banda Wi-Fi 7", "velocidad": "Hasta 18 Gbps agregada", "configuracion": "Configuración intuitiva"}',
 'Envío en 2 - 3 días', 1, false),

('Netgear Orbi 370 Wi-Fi 7 Mesh',
 'Mesh Wi-Fi 7 dual-band accesible, ideal para gaming doméstico.',
 299990.00, 279990.00, 7, 8, 12, 'disponible', 
 'https://http2.mlstatic.com/D_NQ_NP_2X_656700-CBT80138544103_102024-F-sistema-wifi-mesh-netgear-orbi-770-series-rbe772-con-1-satel.webp',
 '{"banda": "Wi-Fi 7 dual-band", "tecnologia": "Multi-Link Operation", "dispositivos": "Hasta 70 dispositivos"}',
 'Envío en 2 - 3 días', 1, false),

('GL-iNet Flint 3 (GL-BE9300) Wi-Fi 7 Router',
 'Router Wi-Fi 7 económico con OpenWRT y VPN integrado.',
 189990.00, 169990.00, 10, 9, 15, 'disponible', 
 'https://http2.mlstatic.com/D_NQ_NP_2X_995376-CBT78623605293_082024-F-router-netgear-nighthawk-tribanda-wifi-7-rs300-de-93-gbps.webp',
 '{"velocidad": "Hasta 9300 Mbps combinados", "puertos": "5 puertos 2.5 GbE", "vpn": "WireGuard / OpenVPN"}',
 'Envío en 1 - 2 días', 1, false),

-- Gaming y Streaming - Micrófonos
('Shure MV7+ USB/XLR Micrófono',
 'Micrófono versátil con conectividad dual USB/XLR para streaming y podcasting profesional.',
 379990.00, 349990.00, 8, 10, 8, 'disponible', 
 'https://http2.mlstatic.com/D_NQ_NP_2X_738701-MLU76928521245_062024-F.webp',
 '{"conectividad": "Dual USB-C/XLR", "panel": "Panel táctil LED integrado", "calidad": "32-bit 48kHz", "filtros": "Denoiser y popper stopper digital", "app": "Shure Motiv Mix incluida"}',
 'Envío en 2 - 3 días', 1, false),

('Blue Yeti X Professional USB Microphone',
 'Micrófono legendario para streaming con cuatro patrones de captación y medidor LED en tiempo real.',
 219990.00, 189990.00, 14, 11, 12, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Blue+Yeti+X',
 '{"patrones": "Cuatro patrones de captación", "medidor": "Medidor LED en tiempo real", "monitoreo": "Monitoreo sin latencia", "controles": "Controles táctiles", "soporte": "Soporte ajustable incluido"}',
 'Envío en 2 - 3 días', 1, false),

('Elgato Wave:3 Premium USB Condenser',
 'Micrófono compacto ideal para streamers con diseño elegante y controles intuitivos.',
 179990.00, 159990.00, 11, 12, 15, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Elgato+Wave3',
 '{"diseño": "Compacto 153x66x40mm", "mute": "Botón mute táctil", "dial": "Dial multifunción frontal", "patron": "Patrón cardioide", "conectividad": "USB-C"}',
 'Envío en 2 - 3 días', 1, false),

('HyperX QuadCast S RGB USB Microphone',
 'Micrófono gaming con iluminación RGB y filtro anti-pop integrado para streamers.',
 199990.00, 174990.00, 13, 13, 10, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=QuadCast+S',
 '{"rgb": "Iluminación RGB personalizable", "filtro": "Filtro anti-pop integrado", "patrones": "Cuatro patrones de grabación", "shock": "Shock mount incluido", "compatibilidad": "PC y consolas"}',
 'Envío en 2 - 3 días', 1, false),

('Rode PodMic USB Dynamic Microphone',
 'Micrófono dinámico profesional diseñado específicamente para podcasting y streaming.',
 249990.00, 229990.00, 8, 14, 7, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Rode+PodMic',
 '{"tipo": "Micrófono dinámico de radiodifusión", "patron": "Patrón polar cardioide", "montaje": "Montaje interno de amortiguación", "filtro": "Filtro pop integrado", "salida": "USB y XLR"}',
 'Envío en 2 - 3 días', 1, false),

-- Computación - Workstations
('Lenovo ThinkPad P1 Gen 7 Mobile Workstation',
 'Workstation móvil ultradelgada con procesador Intel Core Ultra 7 y GPU NVIDIA RTX professional.',
 2899990.00, 2599990.00, 10, 15, 3, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=ThinkPad+P1',
 '{"cpu": "Intel Core Ultra 7 165H", "gpu": "NVIDIA RTX 1000 Ada Generation", "ram": "32GB RAM DDR5", "storage": "1TB SSD NVMe", "pantalla": "16 UHD+ 3840x2400"}',
 'Envío en 5 - 7 días', 1, false),

('Dell Precision 5690 Mobile Workstation',
 'Workstation móvil premium con certificaciones ISV para aplicaciones profesionales.',
 3199990.00, 2849990.00, 11, 16, 2, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Dell+5690',
 '{"cpu": "Intel Core Ultra 9 185H", "gpu": "NVIDIA RTX A2000 8GB", "ram": "64GB RAM DDR5", "storage": "2TB SSD", "pantalla": "16 OLED 4K+"}',
 'Envío en 5 - 7 días', 1, false),

('HP ZBook Ultra G1a 14" Workstation',
 'La workstation móvil de 14" más potente del mundo con AMD Ryzen AI Max PRO.',
 2799990.00, 2499990.00, 11, 17, 4, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=HP+ZBook',
 '{"cpu": "AMD Ryzen AI Max PRO", "gpu": "Graphics integradas de alta gama", "ram": "32GB RAM LPDDR5X", "storage": "1TB SSD Gen4", "pantalla": "14 OLED 2.8K"}',
 'Envío en 5 - 7 días', 1, false),

-- Laptops Business
('ASUS ZenBook 14 OLED (UX3405)',
 'Ultrabook con pantalla OLED vibrante y excelente autonomía para profesionales.',
 1299990.00, 1149990.00, 12, 2, 8, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=ZenBook+14',
 '{"cpu": "Intel Core Ultra 7 155H", "pantalla": "14 OLED 2.8K", "ram": "16GB RAM LPDDR5X", "storage": "1TB SSD PCIe 4.0", "bateria": "Hasta 16 horas"}',
 'Envío en 3 - 4 días', 1, false),

('Framework Laptop 13 (2025) AMD',
 'Laptop modular completamente reparable y actualizable con diseño sostenible.',
 1599990.00, 1399990.00, 13, 18, 6, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Framework+13',
 '{"cpu": "AMD Ryzen AI 300 Series", "modular": "Completamente modular", "puertos": "Puertos intercambiables", "ram": "16GB RAM DDR5", "storage": "512GB SSD (expandible)"}',
 'Envío en 3 - 4 días', 1, false),

-- Smart Home
('Philips Hue Bridge y Kit Iniciación',
 'Sistema de iluminación inteligente con millones de colores y control por voz.',
 199990.00, 179990.00, 10, 19, 12, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Philips+Hue',
 '{"bombillas": "3 bombillas Hue Color", "hub": "Hub Hue Bridge incluido", "colores": "16 millones de colores", "compatibilidad": "Alexa/Google", "control": "Control remoto por app"}',
 'Envío en 2 - 3 días', 1, false),

('Amazon Echo Hub Smart Home Controller',
 'Panel de control central para hogar inteligente con pantalla táctil de 8".',
 249990.00, 199990.00, 20, 20, 8, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Echo+Hub',
 '{"pantalla": "Pantalla táctil 8", "hub": "Hub Zigbee integrado", "control": "Más de 1000 marcas", "alexa": "Alexa integrada", "instalacion": "Instalación en pared"}',
 'Envío en 2 - 3 días', 1, false),

('Google Nest Thermostat Pro',
 'Termostato inteligente que aprende tus horarios y optimiza el consumo energético.',
 329990.00, 279990.00, 15, 21, 10, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Nest+Pro',
 '{"aprendizaje": "Aprendizaje automático", "ahorro": "Ahorro energético del 23%", "control": "Control remoto por app", "compatible": "Google Assistant", "programacion": "Programación inteligente"}',
 'Envío en 2 - 3 días', 1, false),

('Ring Video Doorbell Pro 2',
 'Timbre inteligente con video 4K HDR y detección de movimiento avanzada.',
 399990.00, 329990.00, 18, 22, 7, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Ring+Pro+2',
 '{"video": "Video 4K HDR", "deteccion": "Detección de movimiento 3D", "audio": "Audio bidireccional", "vision": "Visión nocturna", "almacenamiento": "Almacenamiento en la nube"}',
 'Envío en 2 - 3 días', 1, false),

('IKEA TRÅDFRI Gateway Smart Hub',
 'Hub central económico para controlar dispositivos inteligentes IKEA y compatibles.',
 79990.00, 69990.00, 13, 23, 15, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=IKEA+Hub',
 '{"control": "Hasta 100 dispositivos", "compatible": "Alexa/Google", "app": "IKEA Home smart", "protocolo": "Zigbee 3.0", "configuracion": "Fácil configuración"}',
 'Envío en 1 - 2 días', 1, false),

-- Audio y Video
('Sony WH-1000XM6 Wireless Headphones',
 'Auriculares premium con cancelación de ruido líder en la industria y sonido Hi-Res.',
 449990.00, 399990.00, 11, 24, 10, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Sony+XM6',
 '{"cancelacion": "Cancelación de ruido adaptativa", "bateria": "30 horas de batería", "carga": "Carga rápida 3 min = 3 horas", "sonido": "Hi-Res certificado", "controles": "Controles táctiles intuitivos"}',
 'Envío en 2 - 3 días', 1, false),

('Bowers & Wilkins Px8 Over-Ear',
 'Auriculares de lujo con drivers de carbono y diseño premium en cuero genuino.',
 899990.00, 799990.00, 11, 25, 5, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=B%26W+Px8',
 '{"drivers": "Drivers de carbono de 40mm", "cancelacion": "Cancelación de ruido adaptativa", "cuero": "Cuero Nappa genuino", "bateria": "30 horas de batería", "sonido": "Sonido audiófilo excepcional"}',
 'Envío en 2 - 3 días', 1, false),

('JBL 305P MkII Studio Monitors (Par)',
 'Monitores de estudio activos perfectos para principiantes con sonido profesional.',
 399990.00, 349990.00, 13, 26, 8, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=JBL+305P',
 '{"drivers": "Woofer de 5 y tweeter de 1", "potencia": "82W bi-amplificada", "respuesta": "Respuesta plana y amplio sweet spot", "entradas": "XLR y TRS", "uso": "Mezcla y masterización"}',
 'Envío en 2 - 3 días', 1, false),

('Klipsch Vegas Party Speaker RGB',
 'Altavoz de fiesta portátil con iluminación RGB sincronizada y micrófono para karaoke.',
 449990.00, 399990.00, 11, 27, 6, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Klipsch+Vegas',
 '{"tweeter": "Tweeter con bocina Klipsch", "rgb": "Iluminación RGB personalizable", "bateria": "18 horas de batería", "microfono": "Micrófono inalámbrico incluido", "resistencia": "IPX4 resistente a salpicaduras"}',
 'Envío en 2 - 3 días', 1, false),

('Victrola Wave Turntable con Bluetooth',
 'Tocadiscos premium con transmisión inalámbrica Auracast y diseño minimalista moderno.',
 549990.00, 499990.00, 9, 28, 4, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Victrola+Wave',
 '{"transmision": "Transmisión por correa premium", "bluetooth": "Bluetooth con tecnología Auracast", "capsula": "Cápsula magnética móvil", "preamplificador": "Preamplificador conmutable", "diseño": "Diseño minimalista moderno"}',
 'Envío en 3 - 4 días', 1, false),

-- Tablets
('Samsung Galaxy Tab S25 Ultra 5G',
 'Tablet premium con S Pen incluido, pantalla AMOLED 2K y conectividad 5G para máxima productividad.',
 1299990.00, 1149990.00, 12, 29, 8, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Tab+S25+Ultra',
 '{"pantalla": "Super AMOLED 14.6", "procesador": "Snapdragon 8 Gen 3", "ram": "12GB RAM + 256GB", "spen": "S Pen incluido ultra baja latencia", "conectividad": "5G y WiFi 7"}',
 'Envío en 2 - 3 días', 1, false),

('iPad Pro 13" M4 (2025)',
 'La tablet más avanzada con chip M4, pantalla OLED Tandem y compatibilidad con Apple Intelligence.',
 1699990.00, 1549990.00, 9, 30, 5, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=iPad+Pro+M4',
 '{"chip": "Apple M4 de última generación", "pantalla": "OLED Tandem 13", "ia": "Apple Intelligence integrada", "thunderbolt": "Thunderbolt / USB 4", "almacenamiento": "Hasta 2TB"}',
 'Envío en 2 - 3 días', 1, false),

('Xiaomi Pad 7 Pro con Teclado Focus',
 'Tablet con pantalla 144Hz, procesador Snapdragon potente y teclado con trackpad incluido.',
 649990.00, 579990.00, 11, 31, 10, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Xiaomi+Pad+7',
 '{"pantalla": "11.2 3200x2136 144Hz", "procesador": "Snapdragon 8s Gen 3", "teclado": "Teclado Focus con trackpad gratis", "ram": "12GB RAM + 512GB", "os": "HyperOS 2 optimizado para tablets"}',
 'Envío en 2 - 3 días', 1, false),

('Microsoft Surface Pro 11 (2025)',
 'Tablet 2-en-1 ultraligera con Snapdragon X Plus y capacidades de IA avanzadas.',
 1899990.00, 1699990.00, 11, 32, 6, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Surface+Pro+11',
 '{"cpu": "Snapdragon X Plus CPU", "pantalla": "PixelSense 13", "ia": "NPU para IA local", "bateria": "Hasta 19 horas", "windows": "Windows 11 con Copilot+"}',
 'Envío en 2 - 3 días', 1, false),

('Lenovo Yoga Tab Plus AI Edition',
 'Tablet con IA integrada, stylus incluido y teclado cómodo para productividad profesional.',
 799990.00, 749990.00, 6, 15, 7, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Yoga+Tab+Plus',
 '{"procesador": "Procesador con IA integrada", "stylus": "Stylus Lenovo Tab Pen Pro", "teclado": "Teclado premium incluido", "pantalla": "Pantalla 12.7 2.5K", "haptico": "Retroalimentación háptica en stylus"}',
 'Envío en 2 - 3 días', 1, false),

-- Accesorios Móviles
('Anker PowerCore 27,000mAh PD 140W',
 'Batería externa de alta capacidad con carga rápida PD 140W para laptops y dispositivos móviles.',
 149990.00, 129990.00, 13, 33, 15, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Anker+27K',
 '{"capacidad": "27,000mAh", "carga": "Carga rápida PD 140W", "puertos": "3 puertos USB (2 USB-C + 1 USB-A)", "pantalla": "Pantalla digital de carga", "compatible": "MacBook Pro"}',
 'Envío en 1 - 2 días', 1, false),

('Peak Design Mobile Tripod',
 'Trípode ultracompacto y versátil para smartphones con sistema de montaje magnético.',
 99990.00, 89990.00, 10, 34, 12, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Peak+Tripod',
 '{"diseño": "Ultracompacto plegable", "montaje": "Sistema magnético", "compatible": "Todos los smartphones", "construccion": "Aluminio premium", "uso": "Fotografía y video móvil"}',
 'Envío en 1 - 2 días', 1, false),

('Moment Lenses Kit Pro para Móviles',
 'Kit profesional de lentes intercambiables para smartphone con calidad óptica premium.',
 199990.00, 179990.00, 10, 35, 8, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Moment+Lenses',
 '{"gran_angular": "Lente Gran Angular 18mm", "macro": "Lente Macro 10x", "telephoto": "Lente Telephoto 2x", "opticas": "Ópticas de vidrio premium", "compatible": "Fundas Moment"}',
 'Envío en 2 - 3 días', 1, false),

('Belkin 3-in-1 MagSafe Charger Stand',
 'Cargador inalámbrico 3-en-1 MagSafe para iPhone, Apple Watch y AirPods simultáneamente.',
 179990.00, 159990.00, 11, 36, 10, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=Belkin+3in1',
 '{"magsafe": "Carga MagSafe 15W para iPhone", "watch": "Cargador Apple Watch integrado", "airpods": "Base de carga para AirPods", "ajuste": "Ajuste de ángulo flexible", "certificacion": "Certificado MFi por Apple"}',
 'Envío en 1 - 2 días', 1, false),

('SanDisk Extreme PRO microSDXC 1TB',
 'Tarjeta de memoria ultra rápida de 1TB para expandir almacenamiento de smartphones y tablets.',
 249990.00, 219990.00, 12, 37, 18, 'disponible', 
 'https://placehold.co/400x400/1f2937/ffffff?text=SanDisk+1TB',
 '{"capacidad": "1TB (1000GB)", "lectura": "Hasta 200MB/s", "escritura": "Hasta 140MB/s", "resistencia": "Resistente al agua y temperaturas", "ideal": "Video 4K y fotografía RAW"}',
 'Envío en 1 - 2 días', 1, false);

-- Asignar categorías a productos (orden actualizado según frontend)
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES
-- Productos de componentes (GPUs y CPUs) -> categoria_id 3
(1, 3), -- RTX 5060 -> componentes
(2, 3), -- RX 9070 XT -> componentes
(3, 3), -- Arc B580 -> componentes
(4, 3), -- RTX 5070 Ti -> componentes
(5, 3), -- RTX 5090 -> componentes
(6, 3), -- Intel Core i7 -> componentes
(7, 3), -- AMD Ryzen 7 -> componentes

-- Productos de conectividad-redes -> categoria_id 4
(8, 4), -- ASUS ZenWiFi -> conectividad-redes
(9, 4), -- Netgear Orbi -> conectividad-redes
(10, 4), -- GL-iNet Flint -> conectividad-redes

-- Productos de gaming-streaming (micrófonos) -> categoria_id 1
(11, 1), -- Shure MV7+ -> gaming-streaming
(12, 1), -- Blue Yeti X -> gaming-streaming
(13, 1), -- Elgato Wave:3 -> gaming-streaming
(14, 1), -- HyperX QuadCast S -> gaming-streaming
(15, 1), -- Rode PodMic -> gaming-streaming

-- Productos de computacion (laptops) -> categoria_id 2
(16, 2), -- Lenovo ThinkPad P1 -> computacion
(17, 2), -- Dell Precision 5690 -> computacion
(18, 2), -- HP ZBook Ultra -> computacion
(19, 2), -- ASUS ZenBook 14 -> computacion
(20, 2), -- Framework Laptop 13 -> computacion

-- Productos de hogar-oficina (smart home) -> categoria_id 5
(21, 5), -- Philips Hue -> hogar-oficina
(22, 5), -- Amazon Echo Hub -> hogar-oficina
(23, 5), -- Google Nest -> hogar-oficina
(24, 5), -- Ring Video Doorbell -> hogar-oficina
(25, 5), -- IKEA TRÅDFRI -> hogar-oficina

-- Productos de audio-video -> categoria_id 6
(26, 6), -- Sony WH-1000XM6 -> audio-video
(27, 6), -- Bowers & Wilkins Px8 -> audio-video
(28, 6), -- JBL 305P MkII -> audio-video
(29, 6), -- Klipsch Vegas -> audio-video
(30, 6), -- Victrola Wave -> audio-video

-- Productos de otras-categorias (tablets y accesorios) -> categoria_id 7
(31, 7), -- Samsung Galaxy Tab S25 -> otras-categorias
(32, 7), -- iPad Pro 13" M4 -> otras-categorias
(33, 7), -- Xiaomi Pad 7 Pro -> otras-categorias
(34, 7), -- Microsoft Surface Pro 11 -> otras-categorias
(35, 7), -- Lenovo Yoga Tab Plus -> otras-categorias
(36, 7), -- Anker PowerCore -> otras-categorias
(37, 7), -- Peak Design Tripod -> otras-categorias
(38, 7), -- Moment Lenses Kit -> otras-categorias
(39, 7), -- Belkin 3-in-1 MagSafe -> otras-categorias
(40, 7); -- SanDisk Extreme PRO -> otras-categorias

-- Insertar ventas de ejemplo
INSERT INTO ventas (usuario_id, total, estado) VALUES
(1, 389990, 'pendiente'),
(1, 559990, 'entregado'),
(2, 479990, 'pendiente');

-- Insertar detalles de ventas
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 1, 389990.00), -- RTX 5060
(2, 2, 1, 559990.00), -- RX 9070 XT
(3, 6, 1, 479990.00); -- Core i7
