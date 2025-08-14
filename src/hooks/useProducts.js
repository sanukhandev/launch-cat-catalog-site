import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentLanguage } = useI18n();

    // Function to get list of product folders
    const getProductFolders = async () => {
        try {
            // Load the manifest file to get list of available products
            const response = await fetch('/products/manifest.json');
            if (!response.ok) {
                throw new Error('Failed to load products manifest');
            }
            const manifest = await response.json();
            return manifest.products || [];
        } catch (error) {
            console.error('Error getting product folders:', error);
            // Fallback to hardcoded list
            return [
                'launch-x431-pro3s',
                'tlt240sc-lift',
                'creader-3008',
                'cnc602a-injector',
                'tpms-tech-pro',
                'wheel-balancer-wb200'
            ];
        }
    };

    // Function to load a single product's data
    const loadProductData = async (productFolder) => {
        try {
            const response = await fetch(`/products/${productFolder}/data.json`);
            if (!response.ok) {
                throw new Error(`Failed to load product data for ${productFolder}`);
            }
            const productData = await response.json();
            return productData;
        } catch (error) {
            console.error(`Error loading product data for ${productFolder}:`, error);
            return null;
        }
    };

    // Load all products
    const loadAllProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const productFolders = await getProductFolders();
            const productPromises = productFolders.map(folder => loadProductData(folder));
            const productsData = await Promise.all(productPromises);

            // Filter out null results (failed loads)
            const validProducts = productsData.filter(product => product !== null);
            setProducts(validProducts);
        } catch (err) {
            setError(err.message);
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get translated product data
    const getTranslatedProduct = (product) => {
        if (!product || !product.translations) return product;

        const translation = product.translations[currentLanguage] || product.translations['en'] || {};

        return {
            ...product,
            title: translation.title || product.title,
            shortDescription: translation.shortDescription || product.shortDescription,
            longDescription: translation.longDescription || product.longDescription
        };
    };

    // Get all products with translations
    const getProductsWithTranslations = () => {
        return products.map(product => getTranslatedProduct(product));
    };

    // Search products with translations
    const searchProducts = (query) => {
        const translatedProducts = getProductsWithTranslations();
        if (!query.trim()) return translatedProducts;

        const searchTerm = query.toLowerCase();
        return translatedProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.shortDescription.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.categoryId.toLowerCase().includes(searchTerm)
        );
    };

    // Get product by slug with translations
    const getProductBySlug = (slug) => {
        const product = products.find(product => product.slug === slug);
        return product ? getTranslatedProduct(product) : null;
    };

    // Get products by category with translations
    const getProductsByCategory = (categoryId) => {
        const categoryProducts = products.filter(product => product.categoryId === categoryId);
        return categoryProducts.map(product => getTranslatedProduct(product));
    };

    // Load products on mount
    useEffect(() => {
        loadAllProducts();
    }, []);

    return {
        products: getProductsWithTranslations(),
        loading,
        error,
        searchProducts,
        getProductBySlug,
        getProductsByCategory,
        refetch: loadAllProducts
    };
};
