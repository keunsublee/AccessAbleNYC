import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and ReactDOM into their own chunk
          react: ['react', 'react-dom'],
          // Separate Leaflet into its own chunk
          leaflet: ['leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, 
  },
})
