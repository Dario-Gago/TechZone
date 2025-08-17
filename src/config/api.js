// api.js - Configuración de endpoints de la API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  // 🔐 Auth endpoints
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGIN: `${API_BASE_URL}/api/login`,

  // 👥 Usuarios endpoints
  USUARIOS: `${API_BASE_URL}/api/usuarios`,
  USUARIO_BY_ID: (id) => `${API_BASE_URL}/api/usuarios/${id}`,

  // 📂 Categorías endpoints
  CATEGORIAS: `${API_BASE_URL}/api/categorias`,
  CATEGORIA_BY_ID: (id) => `${API_BASE_URL}/api/categorias/${id}`,

  // 🏷️ Marcas endpoints
  MARCAS: `${API_BASE_URL}/api/marcas`,
  MARCA_BY_ID: (id) => `${API_BASE_URL}/api/marcas/${id}`,

  // � Productos endpoints
  PRODUCTOS: `${API_BASE_URL}/api/productos`,
  PRODUCTO_BY_ID: (id) => `${API_BASE_URL}/api/productos/${id}`,

  // � Ventas endpoints
  VENTAS: `${API_BASE_URL}/api/ventas`,
  VENTAS_USER: `${API_BASE_URL}/api/ventas/me`
}

// Ejemplos de uso con query parameters:
// buildUrl(API_ENDPOINTS.PRODUCTOS, { categoria_id: 1, activo: true, page: 1, limit: 10 })
// buildUrl(API_ENDPOINTS.COMPRAS, { page: 1, limit: 20 })
// buildUrl(API_ENDPOINTS.COMPRAS_ADMIN, { usuario_id: 5, page: 1, limit: 10 })
