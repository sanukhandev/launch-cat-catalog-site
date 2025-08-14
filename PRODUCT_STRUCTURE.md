# Product Management System

## Overview

This application now supports dynamic product loading from individual product folders in the `public/products` directory.

## Product Folder Structure

```
public/products/
├── manifest.json                    # Lists all available products
├── product-name-1/
│   ├── data.json                   # Product data and metadata
│   ├── image1.jpg                  # Product images
│   ├── image2.jpg
│   ├── brochure.pdf               # Product brochures
│   ├── manual.pdf                 # User manuals
│   └── other-files.pdf            # Other downloadable files
└── product-name-2/
    ├── data.json
    ├── image1.jpg
    └── ...
```

## Product Data Structure

Each product folder must contain a `data.json` file with the following structure:

```json
{
  "id": "unique-product-id",
  "title": "Product Name",
  "slug": "product-name-slug",
  "sku": "PRODUCT-SKU",
  "price": 1000,
  "inStock": true,
  "categoryId": "category-id",
  "images": [
    "/products/product-folder/image1.jpg",
    "/products/product-folder/image2.jpg"
  ],
  "shortDescription": "Brief product description",
  "longDescription": "Detailed product description",
  "specs": [
    {
      "label": "Specification Name",
      "value": "Specification Value"
    }
  ],
  "downloads": [
    {
      "name": "Document Name",
      "url": "/products/product-folder/document.pdf"
    }
  ]
}
```

## Adding New Products

1. **Create Product Folder**: Create a new folder in `public/products/` with your product name
2. **Add Product Data**: Create `data.json` with product information
3. **Add Media Files**: Place images, PDFs, and other files in the folder
4. **Update Manifest**: Add the folder name to `public/products/manifest.json`

### Example: Adding "new-scanner"

1. Create folder: `public/products/new-scanner/`
2. Add `data.json` with product details
3. Add product images and PDFs
4. Update `manifest.json`:
   ```json
   {
     "products": ["launch-x431-pro3s", "tlt240sc-lift", "new-scanner"]
   }
   ```

## Search Functionality

The search system now works with:

- Product titles
- Product descriptions
- Product SKUs
- Category names

Search queries are automatically handled through URL parameters (`/products?search=query`).

## File Paths

All file paths in the product data should be relative to the public directory:

- Images: `/products/folder-name/image.jpg`
- PDFs: `/products/folder-name/document.pdf`

## Features

- ✅ Dynamic product loading
- ✅ Search functionality
- ✅ Category filtering
- ✅ Product detail pages
- ✅ Download links for PDFs
- ✅ Image galleries
- ✅ Responsive design
- ✅ SEO-friendly URLs
