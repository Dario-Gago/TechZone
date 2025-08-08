import React, { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAutenticacion } from '../contexts/AuthContext'

const IniciarSesion = () => {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [recordarme, setRecordarme] = useState(false)
  const [error, setError] = useState(null)

  const { iniciarSesion } = useAutenticacion()
  const navigate = useNavigate()

  const manejarEnvio = (e) => {
    e.preventDefault()

    // Simulación de credenciales y rol de administrador
    if (correo === 'gagodario1@gmail.com' && contrasena === 'pass1234') {
      const tokenFalso = 'token_falso_123456789'
      const esAdmin = true // este usuario es admin
      iniciarSesion(tokenFalso, esAdmin)
      navigate('/')
    } else if (correo === 'usuario@normal.com' && contrasena === 'pass1234') {
      const tokenFalso = 'token_usuario_normal'
      const esAdmin = false
      iniciarSesion(tokenFalso, esAdmin)
      navigate('/')
    } else {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-600">
            Inicie sesión ingresando su dirección de correo electrónico y
            contraseña.
          </p>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={manejarEnvio}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dirección de correo electrónico
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="email@address.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="••••••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ¿Has olvidado tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
          >
            Iniciar sesión
          </button>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Recuérdame
            </label>
          </div>

          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
            >
              Nueva cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IniciarSesion