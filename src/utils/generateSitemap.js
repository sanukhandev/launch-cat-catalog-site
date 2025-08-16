// Sitemap generator utility
import fs from 'fs';
import path from 'path';
import siteConfig from '../config/siteConfig.json';

const SITE_URL = 'https://launchtech.co.in';

// Generate sitemap entries for static pages
const generateStaticPages = () => {
    const staticPages = [
        {
            url: SITE_URL,
            changefreq: 'daily',
            priority: '1.0',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: `${SITE_URL}/products`,
            changefreq: 'daily',
            priority: '0.9',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: `${SITE_URL}/contact`,
            changefreq: 'monthly',
            priority: '0.8',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: `${SITE_URL}/about`,
            changefreq: 'monthly',
            priority: '0.7',
            lastmod: new Date().toISOString().split('T')[0]
        }
    ];

    return staticPages;
};

// Generate sitemap entries for products
const generateProductPages = () => {
    const products = siteConfig.products || [];

    return products.map(product => ({
        url: `${SITE_URL}/products/${product.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0]
    }));
};

// Generate sitemap entries for categories
const generateCategoryPages = () => {
    const categories = siteConfig.categories || [];

    return categories.map(category => ({
        url: `${SITE_URL}/category/${category.slug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
    }));
};

// Generate XML sitemap
const generateSitemap = () => {
    const staticPages = generateStaticPages();
    const productPages = generateProductPages();
    const categoryPages = generateCategoryPages();

    const allPages = [...staticPages, ...productPages, ...categoryPages];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allPages.forEach(page => {
        sitemap += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
};

// Save sitemap to public folder
export const createSitemap = () => {
    const sitemap = generateSitemap();
    const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');

    try {
        fs.writeFileSync(publicPath, sitemap, 'utf8');
        console.log('✅ Sitemap generated successfully at public/sitemap.xml');
        console.log(`📊 Total URLs: ${generateStaticPages().length + generateProductPages().length + generateCategoryPages().length}`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
};

// For manual execution
if (require.main === module) {
    createSitemap();
}

export default createSitemap;
