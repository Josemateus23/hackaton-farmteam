import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function framesRewritePlugin(): Plugin {
  return {
    name: 'frames-rewrite-plugin',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.startsWith('/frames/landinghero/landinghero_')) {
          req.url = req.url.replace(
            '/frames/landinghero/landinghero_',
            '/frames/landinghero/frames/landinghero_'
          )
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), framesRewritePlugin()],
  server: {
    watch: {
      ignored: [
        '**/scratch/**',
        '**/.git/**',
        '**/evidence/**',
        '**/REFERENCIA_SANTIONI/**',
        '**/public/**',
        '**/*.webm',
        '**/*.mp4',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.webp',
      ],
    },
  },
})
