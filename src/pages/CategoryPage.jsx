import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCategories } from '../hooks/useCategories';
import { useI18n } from '../context/I18nContext';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const { categories, loading: categoriesLoading, getCategoryById, getCategoryProducts } = useCategories();
  const { currentLanguage, t, isRTL } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (categoriesLoading || !categories.length) return;

      const foundCategory = categories.find(cat => cat.slug === categorySlug);
      if (!foundCategory) {
        setLoading(false);
        return;
      }

      setCategory(foundCategory);
      
      try {
        const categoryProducts = await getCategoryProducts(foundCategory.id);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug, categories, categoriesLoading, getCategoryProducts]);

  // Get localized category data
  const getCategoryName = () => {
    if (!category) return '';
    if (typeof category.name === 'object') {
      return category.name[currentLanguage] || category.name.en || category.name;
    }
    return category.name;
  };

  const getCategoryDescription = () => {
    if (!category) return '';
    if (typeof category.description === 'object') {
      return category.description[currentLanguage] || category.description.en || category.description;
    }
    return category.description;
  };

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-foreground">{t('common.categoryNotFound', 'Category not found')}</h1>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('common.backToHome', 'Back to Home')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('common.backToHome', 'Back to Home')}
                </Button>
              </Link>
            </div>
            
            {category.icon && (
              <div className="text-6xl mb-4">{category.icon}</div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {getCategoryName()}
            </h1>
            
            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {getCategoryDescription()}
            </p>
            
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-muted">
                {t('category.productsCount', `${products.length} products available`, { count: products.length })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('category.noProducts', 'No products available')}
            </h3>
            <p className="text-muted">
              {t('category.noProductsDescription', 'Products in this category will be available soon.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
