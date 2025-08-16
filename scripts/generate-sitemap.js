const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://launchtech.co.in';

// Read categories from public folder
const readCategories = () => {
    try {
        const categoriesPath = path.join(__dirname, '../public/categories/manifest.json');
        const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
        const data = JSON.parse(categoriesData);
        return data.categories || [];
    } catch (error) {
        console.warn('Could not read categories manifest:', error.message);
        return [];
    }
};

// Read products from public folder
const readProducts = () => {
    try {
        const productsPath = path.join(__dirname, '../public/products/manifest.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const data = JSON.parse(productsData);
        return data.products || [];
    } catch (error) {
        console.warn('Could not read products manifest:', error.message);
        return [];
    }
};

// Generate sitemap entries for static pages
const generateStaticPages = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    return [
        {
            url: SITE_URL,
            changefreq: 'daily',
            priority: '1.0',
            lastmod: currentDate
        },
        {
            url: `${SITE_URL}/products`,
            changefreq: 'daily',
            priority: '0.9',
            lastmod: currentDate
        },
        {
            url: `${SITE_URL}/contact`,
            changefreq: 'monthly',
            priority: '0.8',
            lastmod: currentDate
        }
    ];
};

// Generate sitemap entries for products
const generateProductPages = () => {
    const products = readProducts();
    const currentDate = new Date().toISOString().split('T')[0];

    return products.map(productSlug => ({
        url: `${SITE_URL}/products/${productSlug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: currentDate
    }));
};

// Generate sitemap entries for categories
const generateCategoryPages = () => {
    const categories = readCategories();
    const currentDate = new Date().toISOString().split('T')[0];

    return categories.map(categorySlug => ({
        url: `${SITE_URL}/category/${categorySlug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: currentDate
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

// Main function to create sitemap
const createSitemap = () => {
    try {
        const sitemap = generateSitemap();
        const publicPath = path.join(__dirname, '../public/sitemap.xml');

        fs.writeFileSync(publicPath, sitemap, 'utf8');

        const staticCount = generateStaticPages().length;
        const productCount = generateProductPages().length;
        const categoryCount = generateCategoryPages().length;
        const totalCount = staticCount + productCount + categoryCount;

        console.log('✅ Sitemap generated successfully!');
        console.log(`📊 Generated ${totalCount} URLs:`);
        console.log(`   - ${staticCount} static pages`);
        console.log(`   - ${productCount} product pages`);
        console.log(`   - ${categoryCount} category pages`);
        console.log(`📁 Saved to: public/sitemap.xml`);

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    createSitemap();
}

module.exports = createSitemap;
