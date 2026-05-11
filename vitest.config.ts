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
        'src/package/components/pa-row/**',
        'src/package/components/pa-col/**',
        'src/package/components/pa-scrollbar/**',
        'src/package/components/pa-scrollbar-list/**',
        'src/package/components/pa-input/**',
        'src/package/components/pa-number/**',
        'src/package/components/pa-select/**',
        'src/package/components/pa-select-icon/**',
        'src/package/components/pa-cascader/**',
        'src/package/components/pa-radio/**',
        'src/package/components/pa-checkbox/**',
        'src/package/components/pa-switch/**',
        'src/package/components/pa-time/**',
        'src/package/components/pa-file/**',
        'src/package/components/pa-message/**',
        'src/package/components/pa-message-box/**',
        'src/package/components/pa-notification/**',
        'src/package/components/pa-form/**',
        'src/package/components/pa-transfer/**',
        'src/package/components/pa-dialog/**',
        'src/package/components/pa-drawer/**',
        'src/package/components/pa-overlay/**',
        'src/package/components/pa-popover/**',
        'src/package/components/pa-tabs/**',
        'src/package/components/pa-pagination/**',
        'src/package/components/pa-development/**',
        'src/package/components/pa-editor/**',
        'src/package/components/pa-manager/**',
        'src/package/components/pa-media-view/**',
        'src/package/components/pa-playground/**',
        'src/package/components/pa-table/**',
      ]
    }
  }
})
