import { useState, useEffect } from 'react';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Search products
    const searchProducts = (query) => {
        if (!query.trim()) return products;

        const searchTerm = query.toLowerCase();
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.shortDescription.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.categoryId.toLowerCase().includes(searchTerm)
        );
    };

    // Get product by slug
    const getProductBySlug = (slug) => {
        return products.find(product => product.slug === slug);
    };

    // Get products by category
    const getProductsByCategory = (categoryId) => {
        return products.filter(product => product.categoryId === categoryId);
    };

    // Load products on mount
    useEffect(() => {
        loadAllProducts();
    }, []);

    return {
        products,
        loading,
        error,
        searchProducts,
        getProductBySlug,
        getProductsByCategory,
        refetch: loadAllProducts
    };
};
