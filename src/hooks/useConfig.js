import { useState, useEffect } from 'react';
import siteConfig from '../config/siteConfig.json';
import { useProducts } from './useProducts';

export const useConfig = () => {
  const [config, setConfig] = useState(siteConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the new products hook
  const {
    products: dynamicProducts,
    loading: productsLoading,
    searchProducts: searchDynamicProducts,
    getProductBySlug: getDynamicProductBySlug,
    getProductsByCategory: getDynamicProductsByCategory
  } = useProducts();

  // Helper functions to get specific parts of config
  const getBrand = () => config.brand;
  const getCompany = () => config.company;
  const getNavigation = () => config.navigation;
  const getHero = () => config.hero;
  const getCategories = () => config.categories;

  // Use dynamic products instead of static ones
  const getProducts = () => dynamicProducts;

  const getTestimonials = () => config.testimonials;
  const getAbout = () => config.about;
  const getFooter = () => config.footer;

  // Get product by slug - use dynamic products
  const getProductBySlug = (slug) => {
    return getDynamicProductBySlug(slug);
  };

  // Get category by slug
  const getCategoryBySlug = (slug) => {
    return config.categories.find(category => category.slug === slug);
  };

  // Get products by category - use dynamic products
  const getProductsByCategory = (categoryId) => {
    return getDynamicProductsByCategory(categoryId);
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    const category = config.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Format price helper
  const formatPrice = (price) => {
    return `AED ${price.toLocaleString()}`;
  };

  // Search products - use dynamic search
  const searchProducts = (query) => {
    return searchDynamicProducts(query);
  };

  return {
    config,
    loading: loading || productsLoading,
    error,
    getBrand,
    getCompany,
    getNavigation,
    getHero,
    getCategories,
    getProducts,
    getTestimonials,
    getAbout,
    getFooter,
    getProductBySlug,
    getCategoryBySlug,
    getProductsByCategory,
    getCategoryName,
    formatPrice,
    searchProducts
  };
};