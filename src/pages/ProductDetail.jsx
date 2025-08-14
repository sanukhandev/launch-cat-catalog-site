import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageCircle, Share2, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useConfig } from '../hooks/useConfig';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const { getProductBySlug, getProductsByCategory, formatPrice } = useConfig();

  useEffect(() => {
    // Find product by slug
    const foundProduct = getProductBySlug(slug);
    setProduct(foundProduct);
    
    if (foundProduct) {
      // Get related products from same category
      const related = getProductsByCategory(foundProduct.categoryId)
        .filter(p => p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [slug, getProductBySlug, getProductsByCategory]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEnquiry = () => {
    // Mock enquiry functionality
    alert(`Enquiry sent for ${product.title}. We'll contact you soon!`);
  };

  const handleDownload = (download) => {
    // Mock download functionality
    alert(`Downloading ${download.name}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="bg-gray-50 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" className="text-primary hover:bg-primary/10">
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
                      selectedImage === index ? 'border-primary' : 'border-transparent'
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
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </Badge>
              
              <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-muted">SKU: {product.sku}</p>
            </div>

            <div className="mb-6">
              <div className="font-heading font-bold text-4xl text-primary mb-4">
                {formatPrice(product.price)}
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
                <MessageCircle className="w-5 h-5 mr-2" />
                Enquire Now
              </Button>
              
              {product.downloads && product.downloads.length > 0 && (
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => handleDownload(product.downloads[0])}
                  className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </Button>
              )}
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <span className="text-sm text-muted">Share:</span>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="font-ui font-semibold">Overview</TabsTrigger>
              <TabsTrigger value="specifications" className="font-ui font-semibold">Specifications</TabsTrigger>
              <TabsTrigger value="downloads" className="font-ui font-semibold">Downloads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="font-heading font-semibold">Product Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed mb-4">
                    {product.longDescription || product.shortDescription}
                  </p>
                  <p className="text-muted leading-relaxed">
                    This professional-grade diagnostic equipment is designed for automotive workshops and service centers 
                    requiring reliable, accurate diagnostic capabilities. Built with Launch's renowned quality and backed 
                    by comprehensive technical support from Candour Auto Tech.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="font-heading font-semibold">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specs && product.specs.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-border last:border-b-0">
                        <span className="font-ui font-semibold text-foreground">{spec.label}</span>
                        <span className="text-muted">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="downloads">
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="font-heading font-semibold">Downloads</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.downloads && product.downloads.length > 0 ? (
                    <div className="space-y-3">
                      {product.downloads.map((download, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-primary" />
                            <span className="font-ui font-semibold text-foreground">{download.name}</span>
                          </div>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(download)}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No downloads available for this product.</p>
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
              You Might Also Like
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