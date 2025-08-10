import React from 'react'

const UserAvatar = ({ name, size = 'w-12 h-12', textSize = 'text-sm' }) => {
  // Obtener iniciales del usuario
  const getInitials = (name) => {
    if (!name) return 'JD'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const initials = getInitials(name)

  return (
    <div className={`${size} bg-black rounded-full flex items-center justify-center`}>
      <span className={`text-white font-semibold ${textSize}`}>{initials}</span>
    </div>
  )
}

export default UserAvatar
