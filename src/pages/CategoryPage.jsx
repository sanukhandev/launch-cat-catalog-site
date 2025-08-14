import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader,
  Car,
  Truck,
  Battery,
  Key,
  Radar,
  Gauge,
  Zap,
  Wrench,
  Package,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useCategories } from "../hooks/useCategories";
import { useI18n } from "../context/I18nContext";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const {
    categories,
    loading: categoriesLoading,
    getCategoryById,
    getCategoryBySlug,
    getCategoryProducts,
  } = useCategories();
  const { t, isRTL } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const loadCategoryData = () => {
      if (categoriesLoading) return;

      // Find category by slug first, then by id
      let foundCategory = getCategoryBySlug(categorySlug);
      if (!foundCategory) {
        foundCategory = getCategoryById(categorySlug);
      }

      if (!foundCategory) {
        setLoading(false);
        return;
      }

      setCategory(foundCategory);

      try {
        const categoryProducts = getCategoryProducts(foundCategory.id);
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error loading category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [
    categorySlug,
    categoriesLoading,
    getCategoryBySlug,
    getCategoryById,
    getCategoryProducts,
  ]);

  // Use translated category data
  const categoryName = category?.translatedName || category?.name || "";
  const categoryDescription =
    category?.translatedDescription || category?.description || "";

  // Icon mapping for Lucide React icons
  const iconMap = {
    Car,
    Truck,
    Battery,
    Key,
    Radar,
    Gauge,
    Zap,
    Wrench,
    Package,
  };

  // Get the icon component
  const IconComponent = category?.icon
    ? iconMap[category.icon] || Package
    : Package;

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center flex-col gap-4 py-16">
          <h1 className="text-2xl font-bold text-foreground">
            {t("common.categoryNotFound", "Category not found")}
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("common.backToHome", "Back to Home")}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Link to="/products">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("common.backToProducts", "Back to Products")}
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                <IconComponent className="w-10 h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {categoryName}
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {categoryDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-muted">
                {t(
                  "category.productsCount",
                  `${products.length} products available`,
                  { count: products.length }
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

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
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("category.noProducts", "No products available")}
            </h3>
            <p className="text-muted">
              {t(
                "category.noProductsDescription",
                "Products in this category will be available soon."
              )}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
