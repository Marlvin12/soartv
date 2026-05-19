import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'SoarTV — Tonight, tuned for you',
    short_name:       'SoarTV',
    description:      'Mood-based streaming, tuned to your Resonance. Watch parties, archetype-curated rows, and the films that meet you where you are.',
    start_url:        '/',
    scope:            '/',
    display:          'standalone',
    orientation:      'portrait-primary',
    background_color: '#07070a',
    theme_color:      '#07070a',
    categories:       ['entertainment', 'lifestyle', 'social'],
    icons: [
      { src: '/icons/icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any'      },
      { src: '/icons/icon-256.png',          sizes: '256x256', type: 'image/png', purpose: 'any'      },
      { src: '/icons/icon-384.png',          sizes: '384x384', type: 'image/png', purpose: 'any'      },
      { src: '/icons/icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any'      },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Movies',  short_name: 'Movies',  url: '/movies' },
      { name: 'TV Shows', short_name: 'TV',     url: '/shows'  },
      { name: 'Library', short_name: 'Library', url: '/library' },
    ],
  }
}
