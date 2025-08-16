// Structured Data utilities for SEO
export const generateProductStructuredData = (product) => {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "description": product.shortDescription || product.longDescription,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Launch Tech"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": "Launch Tech",
            "url": "https://launchtech.co.in"
        },
        "image": product.images,
        "offers": {
            "@type": "Offer",
            "url": `https://launchtech.co.in/products/${product.slug}`,
            "priceCurrency": "AED",
            "price": product.price,
            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Candour Auto Tech",
                "url": "https://launchtech.co.in"
            }
        },
        "category": product.category,
        "additionalProperty": product.specs?.map(spec => ({
            "@type": "PropertyValue",
            "name": spec.label,
            "value": spec.value
        })) || []
    };
};

export const generateCategoryStructuredData = (category, products = []) => {
    return {
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description,
        "url": `https://launchtech.co.in/category/${category.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": products.length,
            "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.title,
                    "url": `https://launchtech.co.in/products/${product.slug}`,
                    "image": product.images[0],
                    "offers": {
                        "@type": "Offer",
                        "price": product.price,
                        "priceCurrency": "AED"
                    }
                }
            }))
        }
    };
};

export const generateOrganizationStructuredData = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Candour Auto Tech",
        "alternateName": "Launch Tech MENA",
        "url": "https://launchtech.co.in",
        "logo": "https://launchtech.co.in/images/logo.png",
        "description": "Authorized LAUNCH dealers and training partner. Professional automotive diagnostic solutions, equipment and technical support for workshops across UAE and MENA region.",
        "sameAs": [
            "https://www.facebook.com/candourautotech",
            "https://www.linkedin.com/company/candourautotech"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+971-4-123-4567",
            "contactType": "customer service",
            "areaServed": ["AE", "SA", "QA", "OM", "KW", "BH"],
            "availableLanguage": ["en", "ar"]
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Al Qusais Industrial Area",
            "addressLocality": "Dubai",
            "addressCountry": "UAE"
        },
        "service": {
            "@type": "Service",
            "name": "Automotive Diagnostic Solutions",
            "description": "Professional automotive diagnostic equipment, training, and technical support",
            "provider": {
                "@type": "Organization",
                "name": "Candour Auto Tech"
            },
            "areaServed": {
                "@type": "Place",
                "name": "UAE and MENA Region"
            }
        }
    };
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    };
};

export const generateLocalBusinessStructuredData = () => {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Candour Auto Tech",
        "image": "https://launchtech.co.in/images/logo.png",
        "@id": "https://launchtech.co.in",
        "url": "https://launchtech.co.in",
        "telephone": "+971-4-123-4567",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Al Qusais Industrial Area",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "postalCode": "00000",
            "addressCountry": "AE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.2048,
            "longitude": 55.2708
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://www.facebook.com/candourautotech",
            "https://www.linkedin.com/company/candourautotech"
        ]
    };
};
