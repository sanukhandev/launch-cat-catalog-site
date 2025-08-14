import { useState, useEffect } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load categories manifest
                const manifestResponse = await fetch('/products/categories/manifest.json');
                if (!manifestResponse.ok) {
                    throw new Error(`Failed to load categories manifest: ${manifestResponse.status}`);
                }
                const manifest = await manifestResponse.json();

                // Load each category's data
                const categoryPromises = manifest.categories.map(async (categoryId) => {
                    try {
                        const response = await fetch(`/products/categories/${categoryId}/data.json`);
                        if (!response.ok) {
                            console.warn(`Failed to load category ${categoryId}: ${response.status}`);
                            return null;
                        }
                        return await response.json();
                    } catch (err) {
                        console.warn(`Error loading category ${categoryId}:`, err);
                        return null;
                    }
                });

                const categoryData = await Promise.all(categoryPromises);
                const validCategories = categoryData.filter(Boolean);

                setCategories(validCategories);
            } catch (err) {
                console.error('Error loading categories:', err);
                setError(err.message);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const getCategoryById = (categoryId) => {
        return categories.find(category => category.id === categoryId);
    };

    const getFeaturedCategories = () => {
        return categories.filter(category => category.featured);
    };

    const getCategoryProducts = async (categoryId) => {
        try {
            const category = getCategoryById(categoryId);
            if (!category || !category.products?.length) {
                return [];
            }

            // Load product data for each product in the category
            const productPromises = category.products.map(async (productId) => {
                try {
                    const response = await fetch(`/products/${productId}/data.json`);
                    if (!response.ok) {
                        console.warn(`Failed to load product ${productId}: ${response.status}`);
                        return null;
                    }
                    return await response.json();
                } catch (err) {
                    console.warn(`Error loading product ${productId}:`, err);
                    return null;
                }
            });

            const products = await Promise.all(productPromises);
            return products.filter(Boolean);
        } catch (err) {
            console.error('Error loading category products:', err);
            return [];
        }
    };

    return {
        categories,
        loading,
        error,
        getCategoryById,
        getFeaturedCategories,
        getCategoryProducts
    };
};
