import vue from './vue'
import html from './html'
import compress from './compress'

/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv) {
  const plugins = [...vue, html(viteEnv)]

  if (viteEnv.VITE_COMPRESS === 'Y') {
    plugins.push(compress(viteEnv))
  }

  return plugins
}
