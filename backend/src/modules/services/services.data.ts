// src/modules/services/services.data.ts
// Datos estáticos para "Explorar grupos".
// En el futuro se puede migrar a DB (tabla Service) y relacionarlo con Group.
/*
export type ServiceItem = {
  slug: string
  name: string
  desc: string
  category: 'peliculas-series' | 'programas' | 'musica'
}

export const SERVICES: ServiceItem[] = [
  // Películas y series
  { slug: 'netflix', name: 'Netflix', desc: 'Series y películas', category: 'peliculas-series' },
  { slug: 'prime-video', name: 'Amazon Prime Video', desc: 'Películas y TV', category: 'peliculas-series' },
  { slug: 'paramount-plus', name: 'Paramount+', desc: 'Películas y TV', category: 'peliculas-series' },
  { slug: 'apple-tv-plus', name: 'Apple TV+', desc: 'Series y películas originales', category: 'peliculas-series' },

  // Programas
  { slug: 'microsoft-365', name: 'Microsoft 365', desc: 'Ofimática y productividad', category: 'programas' },
  { slug: 'google-one', name: 'Google One', desc: 'Almacenamiento y servicios Google', category: 'programas' },
  { slug: 'dropbox', name: 'Dropbox', desc: 'Almacenamiento en la nube', category: 'programas' },
  { slug: 'canva', name: 'Canva', desc: 'Diseño gráfico y plantillas', category: 'programas' },

  // Música
  { slug: 'apple-music', name: 'Apple Music', desc: 'Streaming de música', category: 'musica' },
  { slug: 'spotify', name: 'Spotify', desc: 'Música sin anuncios', category: 'musica' },
  { slug: 'tidal', name: 'Tidal', desc: 'Audio en alta fidelidad', category: 'musica' },
  { slug: 'deezer', name: 'Deezer', desc: 'Música y podcasts', category: 'musica' },
  { slug: 'amazon-music-unlimited', name: 'Amazon Music Unlimited', desc: 'Catálogo completo de Amazon', category: 'musica' },
]

export const CATEGORIES = [
  { key: 'peliculas-series', title: 'Películas y series' },
  { key: 'programas', title: 'Programas' },
  { key: 'musica', title: 'Música' },
] as const

export function getAllServices() {
  return SERVICES
}

export function getCategories() {
  return CATEGORIES
}

export function getServicesByCategory(key: typeof CATEGORIES[number]['key']) {
  return SERVICES.filter(s => s.category === key)
}

export function findBySlug(slug: string) {
  return SERVICES.find(s => s.slug === slug) || null
}
*/