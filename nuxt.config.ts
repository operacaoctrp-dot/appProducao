// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "theme-color", content: "#3B82F6" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          href: "/icons/apple-touch-icon-180x180.svg",
        },
      ],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "App Produção",
      short_name: "Produção",
      description: "Aplicativo de controle de produção",
      theme_color: "#3B82F6",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icons/pwa-64x64.svg",
          sizes: "64x64",
          type: "image/svg+xml",
        },
        {
          src: "/icons/pwa-192x192.svg",
          sizes: "192x192",
          type: "image/svg+xml",
        },
        {
          src: "/icons/pwa-512x512.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/icons/maskable-icon-512x512.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff,woff2}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "supabase-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
