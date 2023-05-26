import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default createSvgIconsPlugin({
  // 指定需要缓存的图标文件夹
  iconDirs: [path.resolve(process.cwd(), 'src/icons')],
  // 指定symbolId格式
  symbolId: 'icon-[dir]-[name]',
})
