/** @type {import('next').NextConfig} */
const prod = process.env.NODE_ENV === 'production'
const runtimeCaching = require('next-pwa/cache')
const withPWA = require('next-pwa')({
  dest: "public",
  customWorkerDir: "serviceworker",
  disable: !prod,
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/]
})

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone'
})

module.exports = nextConfig