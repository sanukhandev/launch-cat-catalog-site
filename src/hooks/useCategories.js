import { useState, useEffect } from 'react';
import { useConfig } from './useConfig';
import { useI18n } from '../context/I18nContext';

export const useCategories = () => {
    const { getCategories, getProducts } = useConfig();
    const { t } = useI18n();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = getCategories();
    const products = getProducts();

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

    // Get products for a specific category
    const getCategoryProducts = (categoryId) => {
        return products.filter(product => product.categoryId === categoryId);
    };

    // Get all categories with translations
    const getCategoriesWithTranslations = () => {
        return categories.map(category => ({
            ...category,
            translatedName: t(`categories.${category.id}.name`, category.name),
            translatedDescription: t(`categories.${category.id}.description`, category.description)
        }));
    };

    return {
        categories: getCategoriesWithTranslations(),
        loading,
        error,
        getFeaturedCategories,
        getCategoryById,
        getCategoryProducts
    };
};
