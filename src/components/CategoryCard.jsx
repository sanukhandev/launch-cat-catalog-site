import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { useI18n } from '../context/I18nContext';

const CategoryCard = ({ category }) => {
  const { currentLanguage, t } = useI18n();

  // Get localized name and description
  const getName = () => {
    if (typeof category.name === 'object') {
      return category.name[currentLanguage] || category.name.en || category.name;
    }
    return category.name;
  };

  const getDescription = () => {
    if (typeof category.description === 'object') {
      return category.description[currentLanguage] || category.description.en || category.description;
    }
    return category.description || `Professional ${getName().toLowerCase()} solutions for automotive workshops and service centers`;
  };

  return (
    <Card className="group bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
        {category.image ? (
          <img
            src={category.image}
            alt={getName()}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {category.icon || '📦'}
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {getName()}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {getDescription()}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link to={`/category/${category.slug}`} className="w-full">
          <Button 
            variant="ghost"
            className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-ui font-semibold text-sm uppercase tracking-wide group/btn transition-all"
          >
            {t('common.viewProducts', 'View Products')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;