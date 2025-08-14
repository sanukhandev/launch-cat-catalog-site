import { useState, useEffect } from 'react';
import siteConfig from '../config/siteConfig.json';

export const useConfig = () => {
  const [config, setConfig] = useState(siteConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper functions to get specific parts of config
  const getBrand = () => config.brand;
  const getCompany = () => config.company;
  const getNavigation = () => config.navigation;
  const getHero = () => config.hero;
  const getCategories = () => config.categories;
  const getProducts = () => config.products;
  const getTestimonials = () => config.testimonials;
  const getAbout = () => config.about;
  const getFooter = () => config.footer;

  // Get product by slug
  const getProductBySlug = (slug) => {
    return config.products.find(product => product.slug === slug);
  };

  // Get category by slug
  const getCategoryBySlug = (slug) => {
    return config.categories.find(category => category.slug === slug);
  };

  // Get products by category
  const getProductsByCategory = (categoryId) => {
    return config.products.filter(product => product.categoryId === categoryId);
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

  // Search products
  const searchProducts = (query) => {
    if (!query.trim()) return config.products;

    const searchTerm = query.toLowerCase();
    return config.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.shortDescription.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm) ||
      product.categoryId.toLowerCase().includes(searchTerm)
    );
  };

  return {
    config,
    loading,
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