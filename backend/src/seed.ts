// ===============================================================
// El propósito de este archivo solo es llenar la base de datos ||
// ===============================================================
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SERVICES_DATA = [
  // ==================== PELÍCULAS Y SERIES ====================
  {
    slug: 'netflix',
    name: 'Netflix',
    description: 'Series y películas ilimitadas',
    category: 'peliculas-series',
    basePriceMXN: 219,
    slots: 4,
    plans: {
      estandar: "Estándar con anuncios",
      premium: "Premium 4K"
    }
  },
  {
    slug: 'prime-video',
    name: 'Amazon Prime Video',
    description: 'Películas, series y contenido original',
    category: 'peliculas-series',
    basePriceMXN: 499,
    slots: 6,
    plans: {
      prime: "Prime Video + Envíos gratis"
    }
  },
  {
    slug: 'paramount-plus',
    name: 'Paramount+',
    description: 'Contenido Paramount, MTV, Nickelodeon',
    category: 'peliculas-series',
    basePriceMXN: 99,
    slots: 3,
    plans: {}
  },
  {
    slug: 'apple-tv-plus',
    name: 'Apple TV+',
    description: 'Series y películas originales Apple',
    category: 'peliculas-series',
    basePriceMXN: 139,
    slots: 6,
    plans: {}
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    description: 'Disney, Pixar, Marvel, Star Wars, National Geographic',
    category: 'peliculas-series',
    basePriceMXN: 159,
    slots: 4,
    plans: {
      standard: "Estándar",
      premium: "Premium con descargas"
    }
  },
  {
    slug: 'hbo-max',
    name: 'Max (HBO)',
    description: 'HBO, Warner Bros, DC, contenido premium',
    category: 'peliculas-series',
    basePriceMXN: 149,
    slots: 5,
    plans: {
      estandar: "Estándar",
      ultra: "Ultra 4K"
    }
  },

  // ==================== PROGRAMAS ====================
  {
    slug: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Office, OneDrive, Teams y más',
    category: 'programas',
    basePriceMXN: 1199,
    slots: 6,
    plans: {
      personal: "Personal",
      familiar: "Familiar (6 personas)"
    }
  },
  {
    slug: 'google-one',
    name: 'Google One',
    description: 'Almacenamiento en la nube y beneficios Google',
    category: 'programas',
    basePriceMXN: 149,
    slots: 5,
    plans: {
      basic: "200GB",
      standard: "2TB",
      premium: "5TB"
    }
  },
  {
    slug: 'dropbox',
    name: 'Dropbox',
    description: 'Almacenamiento en la nube y colaboración',
    category: 'programas',
    basePriceMXN: 199,
    slots: 1,
    plans: {
      plus: "Plus 2TB",
      professional: "Professional 3TB"
    }
  },
  {
    slug: 'canva',
    name: 'Canva Pro',
    description: 'Diseño gráfico y plantillas premium',
    category: 'programas',
    basePriceMXN: 1499,
    slots: 5,
    plans: {
      pro: "Pro",
      teams: "Teams"
    }
  },
  {
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    description: 'Suite completa de Adobe para creativos',
    category: 'programas',
    basePriceMXN: 399,
    slots: 1,
    plans: {
      individual: "Individual",
      teams: "Teams"
    }
  },

  // ==================== MÚSICA ====================
  {
    slug: 'spotify',
    name: 'Spotify Premium',
    description: 'Música sin anuncios y descargas',
    category: 'musica',
    basePriceMXN: 179,
    slots: 6,
    plans: {
      individual: "Individual",
      duo: "Duo",
      familiar: "Familiar"
    }
  },
  {
    slug: 'apple-music',
    name: 'Apple Music',
    description: 'Streaming de música y contenido exclusivo',
    category: 'musica',
    basePriceMXN: 115,
    slots: 6,
    plans: {
      individual: "Individual",
      familiar: "Familiar"
    }
  },
  {
    slug: 'youtube-music',
    name: 'YouTube Music Premium',
    description: 'Música y videos sin anuncios',
    category: 'musica',
    basePriceMXN: 119,
    slots: 5,
    plans: {
      individual: "Individual",
      familiar: "Familiar"
    }
  },
  {
    slug: 'deezer',
    name: 'Deezer Premium',
    description: 'Música, podcasts y recomendaciones',
    category: 'musica',
    basePriceMXN: 119,
    slots: 6,
    plans: {
      individual: "Individual",
      familiar: "Familiar"
    }
  },
  {
    slug: 'amazon-music-unlimited',
    name: 'Amazon Music Unlimited',
    description: 'Catálogo completo de música',
    category: 'musica',
    basePriceMXN: 95,
    slots: 6,
    plans: {
      individual: "Individual",
      familiar: "Familiar"
    }
  },
  {
    slug: 'tidal',
    name: 'Tidal',
    description: 'Audio en alta fidelidad y contenido exclusivo',
    category: 'musica',
    basePriceMXN: 129,
    slots: 5,
    plans: {
      hifi: "HiFi",
      hifi_plus: "HiFi Plus"
    }
  },

  // ==================== JUEGOS ====================
  {
    slug: 'xbox-game-pass',
    name: 'Xbox Game Pass',
    description: 'Catálogo de juegos para PC y consola',
    category: 'juegos',
    basePriceMXN: 229,
    slots: 1,
    plans: {
      pc: "PC",
      ultimate: "Ultimate"
    }
  },
  {
    slug: 'playstation-plus',
    name: 'PlayStation Plus',
    description: 'Juegos online, mensuales y descuentos',
    category: 'juegos',
    basePriceMXN: 1049,
    slots: 1,
    plans: {
      essential: "Essential",
      extra: "Extra",
      premium: "Premium"
    }
  },
  {
    slug: 'nintendo-switch-online',
    name: 'Nintendo Switch Online',
    description: 'Juegos online, NES y SNES classic',
    category: 'juegos',
    basePriceMXN: 599,
    slots: 8,
    plans: {
      individual: "Individual",
      familiar: "Familiar (8 personas)"
    }
  }
];

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
