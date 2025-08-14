import React from 'react'
import { User, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

const UsersTab = ({ usuarios, onEliminarUsuario }) => {
  const usuariosNoAdmin = usuarios.filter((u) => !u.admin)

  const handleEliminarUsuario = async (usuarioId, nombreUsuario) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario "${nombreUsuario || 'Sin nombre'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      try {
        await onEliminarUsuario(usuarioId)

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El usuario ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        })
      }
    }
  }

  if (usuarios.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Usuarios Registrados (0)
        </h3>
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay usuarios registrados</p>
        </div>
      </div>
    )
  }

  if (usuariosNoAdmin.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Usuarios Registrados (0)
        </h3>
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay usuarios no-admin registrados</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Usuarios Registrados ({usuariosNoAdmin.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuariosNoAdmin.map((usuario) => (
          <div
            key={usuario.usuario_id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-base truncate">
                    {usuario.nombre || 'Sin nombre'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {usuario.email || 'Sin email'}
                  </p>
                  {usuario.telefono && (
                    <p className="text-xs text-gray-400 truncate">
                      📞 {usuario.telefono}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  handleEliminarUsuario(usuario.usuario_id, usuario.nombre)
                }
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                title="Eliminar usuario"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersTab
