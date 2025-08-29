/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para producción
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
