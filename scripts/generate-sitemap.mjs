import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = 'https://turkish-kebab-pizza-house.co.uk';
const apiBase = process.env.VITE_API_URL;

const staticRoutes = [
  '/',
  '/cart',
  '/checkout',
  '/orders',
  '/login',
  "/about",
  '/terms',
  '/privacy-policy',
  '/info',
];

try {
  const menuRes = await axios.get(`${apiBase}/menu/menu`);
  const menu = menuRes.data.data || [];

  const firstCategoryId = menu.length > 0 ? menu[0].id : null;
  const productRes = firstCategoryId
    ? await axios.post(`${apiBase}/menu/menu_item`, {
        id: firstCategoryId,
        food_type: false,
      })
    : { data: { data: [] } };

  const menuItems = productRes.data.data || [];

  const categoryUrls = menu.map((cat) => {
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
    return `/menu/${slug}`;
  });

  const productUrls = menuItems.map((item) => {
    const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-');
    return `/product/${slug}`;
  });

  const allUrls = [...staticRoutes, ...categoryUrls, ...productUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap.trim());
 
} catch (err) {
  console.error('❌ Failed to generate sitemap:', err.message);
}
