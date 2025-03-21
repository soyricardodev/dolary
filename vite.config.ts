import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { PWAConfig } from './src/lib/pwa-config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(PWAConfig)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
