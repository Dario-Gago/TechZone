import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

// Configurar axios con interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 60000, // 60 segundos para servicios que pueden "dormir"
})

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar timeout por servicios "dormidos"
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.warn('⏰ Timeout: El servidor puede estar "durmiendo". Intenta de nuevo en unos segundos.')
      // Opcionalmente, podrías mostrar un mensaje al usuario
    }
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
