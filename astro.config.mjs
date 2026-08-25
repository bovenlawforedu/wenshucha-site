import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.wenshucha.com',
  // 预览部署到 GitHub Pages 子路径时传 ASTRO_BASE=/wenshucha-site/，正式上线用默认 /
  base: process.env.ASTRO_BASE || '/',
  integrations: [sitemap()],
});
