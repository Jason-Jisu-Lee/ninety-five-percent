import { defineConfig } from 'vite'
import { sync } from './tools/docs.mjs'

export default defineConfig({
  base: './',
  build: { target: 'es2022' },
  plugins: [{
    name: 'docs',
    buildStart: () => sync(process.cwd()),
    configureServer(server) {
      const fresh = file => {
        if (!/docs.\w+\.md$/.test(file)) return
        try {
          sync(server.config.root)
        } catch (e) {
          server.ws.send({ type: 'error', err: { message: e.message, stack: '' } })
        }
      }
      server.watcher.on('change', fresh).on('add', fresh)
    },
  }],
})
