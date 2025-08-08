import React, { useState } from 'react'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const Registro = () => {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  })
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false)
  const [errores, setErrores] = useState({})
  const [estaCargando, setEstaCargando] = useState(false)

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validar nombre
    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    } else if (datosFormulario.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre no puede exceder 100 caracteres'
    }

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!datosFormulario.email.trim()) {
      nuevosErrores.email = 'El email es requerido'
    } else if (!regexEmail.test(datosFormulario.email)) {
      nuevosErrores.email = 'Ingresa un email válido'
    } else if (datosFormulario.email.length > 100) {
      nuevosErrores.email = 'El email no puede exceder 100 caracteres'
    }

    // Validar contraseña
    if (!datosFormulario.password) {
      nuevosErrores.password = 'La contraseña es requerida'
    } else if (datosFormulario.password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    // Validar confirmación de contraseña
    if (datosFormulario.password !== datosFormulario.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden'
    }

    // Validar teléfono (opcional pero con formato)
    if (datosFormulario.telefono && datosFormulario.telefono.length > 20) {
      nuevosErrores.telefono = 'El teléfono no puede exceder 20 caracteres'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const manejarCambioInput = (e) => {
    const { name, value } = e.target
    setDatosFormulario((prev) => ({
      ...prev,
      [name]: value
    }))

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const manejarEnvio = async () => {
    if (!validarFormulario()) {
      return
    }

    setEstaCargando(true)

    try {
      // Simular llamada a API
      console.log('Datos de registro:', {
        nombre: datosFormulario.nombre,
        email: datosFormulario.email,
        password: datosFormulario.password, // En producción, esto se hashearía en el backend
        telefono: datosFormulario.telefono || null,
        direccion: datosFormulario.direccion || null
      })

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('¡Registro exitoso! Bienvenido/a ' + datosFormulario.nombre)

      // Resetear formulario
      setDatosFormulario({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        direccion: ''
      })
    } catch (error) {
      console.error('Error en el registro:', error)
      alert('Error al registrar usuario. Intenta nuevamente.')
    } finally {
      setEstaCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Completa tus datos para registrarte en nuestra plataforma
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errores.nombre
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="Tu nombre completo"
                  value={datosFormulario.nombre}
                  onChange={manejarCambioInput}
                />
              </div>
              {errores.nombre && (
                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errores.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="email@ejemplo.com"
                  value={datosFormulario.email}
                  onChange={manejarCambioInput}
                />
              </div>
              {errores.email && (
                <p className="mt-1 text-sm text-red-600">{errores.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={mostrarContrasena ? 'text' : 'password'}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errores.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="Mínimo 8 caracteres"
                  value={datosFormulario.password}
                  onChange={manejarCambioInput}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                >
                  {mostrarContrasena ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errores.password && (
                <p className="mt-1 text-sm text-red-600">{errores.password}</p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={mostrarConfirmarContrasena ? 'text' : 'password'}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errores.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="Repite tu contraseña"
                  value={datosFormulario.confirmPassword}
                  onChange={manejarCambioInput}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                >
                  {mostrarConfirmarContrasena ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errores.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errores.confirmPassword}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errores.telefono
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="+56 9 1234 5678"
                  value={datosFormulario.telefono}
                  onChange={manejarCambioInput}
                />
              </div>
              {errores.telefono && (
                <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dirección
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="direccion"
                  name="direccion"
                  rows={3}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                  placeholder="Tu dirección completa (opcional)"
                  value={datosFormulario.direccion}
                  onChange={manejarCambioInput}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">
              Los campos marcados con * son obligatorios
            </p>
          </div>

          <button
            type="submit"
            disabled={estaCargando}
            onClick={manejarEnvio}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200 ${estaCargando
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {estaCargando ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando cuenta...
              </div>
            ) : (
              'Crear cuenta'
            )}
          </button>

          <div className="mt-6">
            <Link
              to="/login"
              type="button"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </Link>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Registro
// Compatibilidad hacia atrás
export { Registro as Register }
