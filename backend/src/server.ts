import 'dotenv/config'
import app from './app'

// Puerto configurable vía .env
const PORT = process.env.PORT || 4000

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
})

