import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { useConfig } from "../hooks/useConfig";
import { useI18n } from "../context/I18nContext";

const ProductCard = ({ product }) => {
  const { formatPrice } = useConfig();
  const { t, formatPrice: i18nFormatPrice, isRTL } = useI18n();

  return (
    <Card className="group bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-border overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={product.inStock ? "default" : "secondary"}
            className={`text-xs font-ui font-semibold ${
              product.inStock
                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100"
                : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {product.inStock ? t("common.inStock") : t("common.outOfStock")}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-2">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
          <p className="text-muted text-sm mb-2">SKU: {product.sku}</p>
        </div>

        <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="font-heading font-bold text-xl text-primary">
            {i18nFormatPrice(product.price)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link to={`/products/${product.slug}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-ui font-semibold text-sm uppercase tracking-wide group/btn transition-all"
            disabled={!product.inStock}
          >
            {t("common.viewDetails")}
            <ArrowRight
              className={`w-4 h-4 ${isRTL ? "mr-2" : "ml-2"} group-hover/btn:${
                isRTL ? "-translate-x-1" : "translate-x-1"
              } transition-transform`}
            />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
