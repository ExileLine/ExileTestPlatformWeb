import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { getRootPath, getSrcPath, viteDefine, setupVitePlugins } from './build'

function resolve(dir) {
  return path.join(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd())
  const rootPath = getRootPath()
  const srcPath = getSrcPath()

  return {
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
        '@api': resolve('src/api'),
        '@view': resolve('src/views'),
        '@util': resolve('src/utils'),
        '@hook': resolve('src/hooks'),
        '@style': resolve('src/styles'),
        '@comp': resolve('src/components'),
      },
    },
    plugins: setupVitePlugins(viteEnv),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables";`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3200,
      open: true,
    },
    preview: {
      port: 5050,
    },
    optimizeDeps: {
      include: ['echarts', 'tdesign-vue-next'],
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
