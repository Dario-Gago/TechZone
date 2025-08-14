// api.js - Configuración de endpoints de la API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  // 🔐 Auth endpoints
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGIN: `${API_BASE_URL}/api/login`,

  // 👥 Usuarios endpoints
  USUARIOS: `${API_BASE_URL}/api/usuarios`,
  USUARIO_BY_ID: (id) => `${API_BASE_URL}/usuarios/${id}`,

  // 📂 Categorías endpoints
  CATEGORIAS: `${API_BASE_URL}/categorias`,
  CATEGORIA_BY_ID: (id) => `${API_BASE_URL}/categorias/${id}`,

  // 📦 Productos endpoints
  PRODUCTOS: `${API_BASE_URL}/productos`,
  PRODUCTO_BY_ID: (id) => `${API_BASE_URL}/productos/${id}`,

  // 🛒 Carrito endpoints
  CARRITO: `${API_BASE_URL}/carrito`,
  CARRITO_ITEM: (producto_id) => `${API_BASE_URL}/carrito/${producto_id}`,

  // 💳 Compras endpoints
  COMPRAS: `${API_BASE_URL}/compras`,
  COMPRAS_ADMIN: `${API_BASE_URL}/compras/admin`
}

// Ejemplos de uso con query parameters:
// buildUrl(API_ENDPOINTS.PRODUCTOS, { categoria_id: 1, activo: true, page: 1, limit: 10 })
// buildUrl(API_ENDPOINTS.COMPRAS, { page: 1, limit: 20 })
// buildUrl(API_ENDPOINTS.COMPRAS_ADMIN, { usuario_id: 5, page: 1, limit: 10 })
