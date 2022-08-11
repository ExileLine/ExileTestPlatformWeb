import { createHtmlPlugin } from 'vite-plugin-html'

export default viteEnv => {
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        appName: viteEnv.VITE_APP_NAME,
        appTitle: viteEnv.VITE_APP_TITLE,
      },
    },
  })
}
