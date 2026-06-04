import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
 base: './',
 plugins: [
   react(),
   VitePWA({
     registerType: 'autoUpdate',
     includeAssets: [
       'favicon.svg',
       'favicon.ico',
       'robots.txt',
       'apple-touch-icon.png',
     ],
      manifest: {
        name: "BusOnTime Floripa",
        short_name: "BusOnTime",
        description:
          "Acompanhe ônibus em tempo real em Florianópolis: rastreio GPS, lotação por IA e carteira digital.",
        theme_color: "#0e7c8a",
        background_color: "#0f1117",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "pt-BR",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cacheia também os tiles do OpenStreetMap pra funcionar offline
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[a-c]\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
              },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*\.(?:css|js)/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "unpkg-cdn",
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
