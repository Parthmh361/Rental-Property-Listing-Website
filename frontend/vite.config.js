import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
    // Optionally proxy API if needed:
    // proxy: {
    //   '/api': 'http://localhost:5000'
    // }
  }
})
