require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
app.listen(
  PORT,
  console.log(
    `Servidor corriendo en el puerto ${PORT}. Puede acceder a la API en http://localhost:${PORT}`
  )
)
