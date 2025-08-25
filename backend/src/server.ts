// server.ts
// ===============================
// Punto de arranque del backend
// - Carga variables de entorno (.env)
// - Importa la app principal (Express)
// - Inicia servidor HTTP en el puerto indicado
// ===============================

import 'dotenv/config'
import app from './app'

// Puerto configurable vía .env
const PORT = process.env.PORT || 4000

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
})

// ===============================
// Notas / Mejores prácticas
// ===============================
// - Si usas pm2 o Docker, PORT lo inyectas por env.
// - Puedes añadir un handler para errores no capturados:
//     process.on('unhandledRejection', ...)
//     process.on('uncaughtException', ...)
// - Para entornos cloud, suele usarse 0.0.0.0 como host:
//     app.listen(PORT, '0.0.0.0', () => {...})
