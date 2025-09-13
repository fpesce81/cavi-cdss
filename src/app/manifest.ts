import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CAVI Risk Assessment CDSS',
    short_name: 'CAVI CDSS',
    description: 'Clinical Decision Support System for cardiovascular risk assessment',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }
    ],
  }
}

