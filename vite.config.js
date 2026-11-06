// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
  
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy toutes les requêtes commençant par /api vers le serveur Flask
      '/api': {
        target: 'http://localhost:5000', // URL de votre serveur Flask
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Supprime le /api du chemin
      }
    }
  }
})