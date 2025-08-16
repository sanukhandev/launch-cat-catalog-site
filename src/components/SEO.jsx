import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Launch Tech | Candour Auto Tech - Authorized LAUNCH Dealers & Training Partner",
  description = "Candour Auto Tech - Authorized LAUNCH dealers and training partner. Professional automotive diagnostic solutions, equipment and technical support for workshops across UAE and MENA region.",
  keywords = "automotive diagnostic tools, LAUNCH scanners, car diagnostic equipment, UAE, MENA, automotive workshops, diagnostic solutions",
  canonical,
  ogImage = "/images/logo.png",
  ogType = "website",
  noindex = false,
  structuredData,
  category,
  product,
}) => {
  // Generate dynamic title based on page type
  const getPageTitle = () => {
    if (product) {
      return `${product.title} - ${product.category} | Launch Tech MENA`;
    }
    if (category) {
      return category.seo?.title || `${category.name} | Launch Tech MENA`;
    }
    return title;
  };

  // Generate dynamic description
  const getPageDescription = () => {
    if (product) {
      return product.shortDescription || product.longDescription || description;
    }
    if (category) {
      return category.seo?.description || category.description || description;
    }
    return description;
  };

  // Generate keywords
  const getKeywords = () => {
    if (product) {
      return `${product.title}, ${product.sku}, automotive diagnostic, ${product.category}, ${keywords}`;
    }
    if (category) {
      const categoryKeywords = category.seo?.keywords || [];
      return [...categoryKeywords, keywords].join(", ");
    }
    return keywords;
  };

  // Get canonical URL
  const getCanonicalUrl = () => {
    if (canonical) return canonical;
    if (product) return `https://launchtech.co.in/products/${product.slug}`;
    if (category) return `https://launchtech.co.in/category/${category.slug}`;
    return "https://launchtech.co.in";
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{getPageTitle()}</title>
      <meta name="description" content={getPageDescription()} />
      <meta name="keywords" content={getKeywords()} />
      <link rel="canonical" href={getCanonicalUrl()} />

      {/* Robots Meta */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={getPageDescription()} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:site_name" content="Launch Tech | Candour Auto Tech" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getPageTitle()} />
      <meta name="twitter:description" content={getPageDescription()} />
      <meta name="twitter:image" content={ogImage} />

      {/* Product specific meta tags */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="AED" />
          <meta
            property="product:availability"
            content={product.inStock ? "in stock" : "out of stock"}
          />
          <meta property="product:brand" content="Launch Tech" />
          <meta property="product:category" content={product.category} />
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional Meta Tags */}
      <meta name="author" content="Candour Auto Tech" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="AE" />
      <meta name="geo.placename" content="UAE" />
      <meta name="theme-color" content="#b91c3c" />
    </Helmet>
  );
};

export default SEO;
