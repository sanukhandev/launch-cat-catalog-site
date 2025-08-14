import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

export const useCategoriesFile = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useI18n();

    // Function to get list of category folders
    const getCategoryFolders = async () => {
        try {
            // Load the manifest file to get list of available categories
            const response = await fetch('/categories/manifest.json');
            if (!response.ok) {
                throw new Error('Failed to load categories manifest');
            }
            const manifest = await response.json();
            return manifest.categories || [];
        } catch (error) {
            console.error('Error getting category folders:', error);
            // Fallback to hardcoded list
            return [
                'passenger-car-diagnostics',
                'heavy-duty-diagnostics',
                'battery-diagnostics',
                'immo-tools',
                'adas-tools',
                'tpms-tools',
                'ev-tools',
                'diy-tools'
            ];
        }
    };

    // Function to load a single category's data
    const loadCategoryData = async (categoryFolder) => {
        try {
            const response = await fetch(`/categories/${categoryFolder}/data.json`);
            if (!response.ok) {
                throw new Error(`Failed to load category data for ${categoryFolder}`);
            }
            const categoryData = await response.json();
            return categoryData;
        } catch (error) {
            console.error(`Error loading category data for ${categoryFolder}:`, error);
            return null;
        }
    };

    // Load all categories
    const loadAllCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const categoryFolders = await getCategoryFolders();
            const categoryPromises = categoryFolders.map(folder => loadCategoryData(folder));
            const categoriesData = await Promise.all(categoryPromises);

            // Filter out null results (failed loads)
            const validCategories = categoriesData.filter(category => category !== null);
            setCategories(validCategories);
        } catch (err) {
            setError(err.message);
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get featured categories with translations
    const getFeaturedCategories = () => {
        return categories
            .filter(category => category.featured || true)
            .map(category => ({
                ...category,
                translatedName: t(`categories.${category.id}.name`, category.name),
                translatedDescription: t(`categories.${category.id}.description`, category.description)
            }));
    };

    // Get category by ID with translations
    const getCategoryById = (categoryId) => {
        const category = categories.find(category => category.id === categoryId);
        if (category) {
            return {
                ...category,
                translatedName: t(`categories.${category.id}.name`, category.name),
                translatedDescription: t(`categories.${category.id}.description`, category.description)
            };
        }
        return null;
    };

    // Get category by slug with translations
    const getCategoryBySlug = (slug) => {
        const category = categories.find(category => category.slug === slug);
        if (category) {
            return {
                ...category,
                translatedName: t(`categories.${category.id}.name`, category.name),
                translatedDescription: t(`categories.${category.id}.description`, category.description)
            };
        }
        return null;
    };

    // Get all categories with translations
    const getCategoriesWithTranslations = () => {
        return categories.map(category => ({
            ...category,
            translatedName: t(`categories.${category.id}.name`, category.name),
            translatedDescription: t(`categories.${category.id}.description`, category.description)
        }));
    };

    // Search categories
    const searchCategories = (query) => {
        if (!query.trim()) return getCategoriesWithTranslations();

        const searchTerm = query.toLowerCase();
        return getCategoriesWithTranslations().filter(category =>
            category.name.toLowerCase().includes(searchTerm) ||
            category.description.toLowerCase().includes(searchTerm) ||
            category.translatedName.toLowerCase().includes(searchTerm) ||
            category.translatedDescription.toLowerCase().includes(searchTerm)
        );
    };

    // Load categories on mount
    useEffect(() => {
        loadAllCategories();
    }, []);

    return {
        categories: getCategoriesWithTranslations(),
        loading,
        error,
        getFeaturedCategories,
        getCategoryById,
        getCategoryBySlug,
        searchCategories,
        refetch: loadAllCategories
    };
};
