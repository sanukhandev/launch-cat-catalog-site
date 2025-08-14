import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import { useCategoriesFile } from './useCategoriesFile';
import { useI18n } from '../context/I18nContext';

export const useCategories = () => {
    const { products } = useProducts();
    const {
        categories,
        loading,
        error,
        getFeaturedCategories: getFileFeaturedCategories,
        getCategoryById: getFileCategoryById,
        getCategoryBySlug: getFileCategoryBySlug
    } = useCategoriesFile();
    const { t } = useI18n();

    // Get featured categories with translations
    const getFeaturedCategories = () => {
        return getFileFeaturedCategories();
    };

    // Get category by ID with translations
    const getCategoryById = (categoryId) => {
        return getFileCategoryById(categoryId);
    };

    // Get category by slug with translations
    const getCategoryBySlug = (slug) => {
        return getFileCategoryBySlug(slug);
    };

    // Get products for a specific category
    const getCategoryProducts = (categoryId) => {
        return products.filter(product => product.categoryId === categoryId);
    };

    // Get all categories with translations
    const getCategoriesWithTranslations = () => {
        return categories;
    };

    return {
        categories: getCategoriesWithTranslations(),
        loading,
        error,
        getFeaturedCategories,
        getCategoryById,
        getCategoryBySlug,
        getCategoryProducts
    };
};
