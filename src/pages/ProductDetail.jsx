import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  MessageCircle,
  Share2,
  CheckCircle,
  XCircle,
  Phone,
  BookOpen,
  Mail,
  CreditCard,
  Truck,
  Calendar,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useProducts } from "../hooks/useProducts";
import { useI18n } from "../context/I18nContext";
import {
  generateProductStructuredData,
  generateBreadcrumbStructuredData,
} from "../utils/structuredData";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { getProductBySlug, getProductsByCategory } = useProducts();
  const { t, formatPrice: i18nFormatPrice, isRTL } = useI18n();

  useEffect(() => {
    // Find product by slug
    const foundProduct = getProductBySlug(slug);
    setProduct(foundProduct);

    if (foundProduct) {
      // Get related products from same category
      const related = getProductsByCategory(foundProduct.categoryId)
        .filter((p) => p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [slug, getProductBySlug, getProductsByCategory]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-4">
            Product Not Found
          </h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEnquiry = () => {
    // Open contact form or navigate to contact page
    window.open(`/contact?product=${product.sku}`, "_blank");
  };

  const handleContact = () => {
    // Open contact page
    window.open("/contact", "_blank");
  };

  const handleTraining = () => {
    // Open training inquiry
    window.open(`/contact?training=${product.sku}`, "_blank");
  };

  const handleDownload = (download) => {
    // Mock download functionality
    alert(`Downloading ${download.name}...`);
  };

  // Generate structured data and breadcrumbs
  const productStructuredData = product
    ? generateProductStructuredData(product)
    : null;
  const breadcrumbs = [
    { name: "Home", url: "https://launchtech.co.in" },
    { name: "Products", url: "https://launchtech.co.in/products" },
    {
      name: product?.title || "Product",
      url: `https://launchtech.co.in/products/${product?.slug}`,
    },
  ];
  const breadcrumbStructuredData =
    generateBreadcrumbStructuredData(breadcrumbs);
  const combinedStructuredData = [
    productStructuredData,
    breadcrumbStructuredData,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {product && (
        <SEO
          product={product}
          structuredData={combinedStructuredData}
          ogImage={product.images[0]}
          ogType="product"
        />
      )}
      <Header />

      {/* Breadcrumb */}
      <section className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge
                variant={product.inStock ? "default" : "secondary"}
                className={`mb-3 ${
                  product.inStock
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100"
                    : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-1">
                  {product.inStock ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {product.inStock
                    ? t("common.inStock", "In Stock")
                    : t("common.outOfStock", "Out of Stock")}
                </div>
              </Badge>

              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-muted">SKU: {product.sku}</p>
            </div>

            <div className="mb-6">
              <div className="font-heading font-bold text-4xl text-primary mb-4">
                {i18nFormatPrice(product.price)}
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleEnquiry}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide flex-1"
              >
                <MessageCircle
                  className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                />
                {t("common.enquireNow", "Enquire Now")}
              </Button>

              {product.downloads && product.downloads.length > 0 && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleDownload(product.downloads[0])}
                  className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide"
                >
                  <Download className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("common.downloadBrochure", "Download Brochure")}
                </Button>
              )}
            </div>

            {/* Additional Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Button
                variant="outline"
                onClick={handleContact}
                className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {t("common.contactNow", "Contact Now")}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleEnquiry}
                className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {t("common.getQuote", "Get Quote")}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleTraining}
                className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {t("common.bookTraining", "Book Training")}
                </span>
              </Button>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
                {t("products.paymentMethods", "Payment Methods")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {t("products.cashOnDelivery", "Cash on Delivery")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("products.codDescription", "Pay when you receive")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {t("products.onlinePayment", "Online Payment")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("products.onlineDescription", "Card, Bank Transfer")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      {t("products.rentalInstallment", "Rental Installment")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(
                        "products.installmentDescription",
                        "Flexible payment plans"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>
                      {t("products.paymentNote", "Payment Options Available")}:
                    </strong>{" "}
                    {t(
                      "products.paymentNoteDescription",
                      "Contact our sales team to discuss payment terms, financing options, and rental plans tailored to your business needs."
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <span className="text-sm text-muted">
                {t("common.share", "Share")}:
              </span>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="font-ui font-semibold text-sm h-10 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              >
                {t("products.overview", "Overview")}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="font-ui font-semibold text-sm h-10 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              >
                {t("products.specifications", "Specifications")}
              </TabsTrigger>
              <TabsTrigger
                value="downloads"
                className="font-ui font-semibold text-sm h-10 rounded-md data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
              >
                {t("products.downloads", "Downloads")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">
                    {t("products.productOverview", "Product Overview")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed mb-4 text-base">
                      {product.longDescription || product.shortDescription}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {t(
                        "products.professionalGrade",
                        "This professional-grade diagnostic equipment is designed for automotive workshops and service centers requiring reliable, accurate diagnostic capabilities. Built with Launch's renowned quality and backed by comprehensive technical support from Candour Auto Tech."
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">
                    {t(
                      "products.technicalSpecifications",
                      "Technical Specifications"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {product.specs && product.specs.length > 0 ? (
                    <div className="space-y-4">
                      {product.specs.map((spec, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        >
                          <span className="font-ui font-semibold text-foreground mb-1 sm:mb-0 text-sm">
                            {spec.label}
                          </span>
                          <span className="text-muted-foreground text-sm break-words sm:max-w-[60%] sm:text-right">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {t(
                        "products.noSpecifications",
                        "No specifications available for this product."
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downloads" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="font-heading font-semibold text-xl text-foreground">
                    {t("products.downloads", "Downloads")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {product.downloads && product.downloads.length > 0 ? (
                    <div className="space-y-3">
                      {product.downloads.map((download, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="font-ui font-semibold text-foreground">
                              {download.name}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(download)}
                            className="flex-shrink-0"
                          >
                            {t("common.download", "Download")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {t(
                        "products.noDownloads",
                        "No downloads available for this product."
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-heading font-semibold text-2xl lg:text-3xl text-foreground mb-8">
              {t("products.youMightAlsoLike", "You Might Also Like")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
