import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/profile': 'http://localhost:8000',
      '/outfits': 'http://localhost:8000',
      '/wardrobe': 'http://localhost:8000',
    }
  }
})
