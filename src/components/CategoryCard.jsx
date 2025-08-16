import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
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
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useI18n } from "../context/I18nContext";

const CategoryCard = ({ category }) => {
  const { t, isRTL } = useI18n();

  // Use translated name and description if available, otherwise fallback to original
  const categoryName = category.translatedName || category.name;
  const categoryDescription =
    category.translatedDescription ||
    category.description ||
    `Professional ${categoryName.toLowerCase()} solutions for automotive workshops and service centers`;

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
  const IconComponent = iconMap[category.icon] || Package;

  return (
    <Card className="group bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        {category.image && false ? (
          <img
            src={category.image}
            alt={categoryName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
            <IconComponent className="w-16 h-16 text-primary" />
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {categoryName}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {categoryDescription}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link
          to={`/category/${category.slug || category.id}`}
          className="w-full"
        >
          <Button
            variant="ghost"
            className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-ui font-semibold text-sm uppercase tracking-wide group/btn transition-all"
          >
            {t("common.viewProducts", "View Products")}
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

export default CategoryCard;
