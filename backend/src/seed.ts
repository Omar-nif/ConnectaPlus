// ===============================================================
// El proposito de este archivo solo es llenar la base de datos ||
//================================================================
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SERVICES_DATA = [
  // Películas y series
  { slug: 'netflix', name: 'Netflix', description: 'Series y películas', category: 'peliculas-series' },
  { slug: 'prime-video', name: 'Amazon Prime Video', description: 'Películas y TV', category: 'peliculas-series' },
  { slug: 'paramount-plus', name: 'Paramount+', description: 'Películas y TV', category: 'peliculas-series' },
  { slug: 'apple-tv-plus', name: 'Apple TV+', description: 'Series y películas originales', category: 'peliculas-series' },

  // Programas
  { slug: 'microsoft-365', name: 'Microsoft 365', description: 'Ofimática y productividad', category: 'programas' },
  { slug: 'google-one', name: 'Google One', description: 'Almacenamiento y servicios Google', category: 'programas' },
  { slug: 'dropbox', name: 'Dropbox', description: 'Almacenamiento en la nube', category: 'programas' },
  { slug: 'canva', name: 'Canva', description: 'Diseño gráfico y plantillas', category: 'programas' },

  // Música
  { slug: 'apple-music', name: 'Apple Music', description: 'Streaming de música', category: 'musica' },
  { slug: 'spotify', name: 'Spotify', description: 'Música sin anuncios', category: 'musica' },
  { slug: 'tidal', name: 'Tidal', description: 'Audio en alta fidelidad', category: 'musica' },
  { slug: 'deezer', name: 'Deezer', description: 'Música y podcasts', category: 'musica' },
  { slug: 'amazon-music-unlimited', name: 'Amazon Music Unlimited', description: 'Catálogo completo de Amazon', category: 'musica' },
]

async function main() {
  console.log('Poblando base de datos con servicios...')
  
  for (const serviceData of SERVICES_DATA) {
    await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: serviceData,
      create: serviceData,
    })
    console.log(`✅ ${serviceData.name} agregado`)
  }
  
  console.log('🎉 Base de datos poblada exitosamente!')
}

main()
  .catch((e) => {
    console.error('Error poblando base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })