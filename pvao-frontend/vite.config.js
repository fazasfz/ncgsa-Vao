// This is the control panel for Vite, your build tool.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nasa-horizons': {
        target: 'https://ssd.jpl.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nasa-horizons/, '/api/horizons.api'),
        secure: false,
      },
      '/api/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})