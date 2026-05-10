import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@m': resolve(__dirname, 'src/package/components'),
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/package/components/pa-icon/**',
        'src/package/components/pa-button/**',
        'src/package/components/pa-color/**',
        'src/package/components/pa-tag/**',
        'src/package/components/pa-badge/**',
        'src/package/components/pa-title/**',
        'src/package/components/pa-line/**',
        'src/package/components/pa-empty/**',
      ]
    }
  }
})
