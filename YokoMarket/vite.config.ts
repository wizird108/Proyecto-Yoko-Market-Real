import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Render publica la app en <nombre>.onrender.com; permitimos ese dominio
  preview: {
    allowedHosts: ['.onrender.com'],
  },
})
