import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const csv = (value, fallback = []) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .concat(value ? [] : fallback)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const allowedHosts = csv(env.VITE_ALLOWED_HOSTS, ['app.trafway.com'])

  return {
    base: env.VITE_BASE_PATH || '/manager_chat/',
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_DEV_PORT || 5177),
      allowedHosts,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: Number(env.VITE_PREVIEW_PORT || env.VITE_DEV_PORT || 5177),
      allowedHosts,
    },
  }
})
