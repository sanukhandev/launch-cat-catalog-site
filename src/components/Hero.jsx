import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useConfig } from '../hooks/useConfig';

const Hero = () => {
  const { getHero } = useConfig();
  const hero = getHero();

  const iconMap = {
    CheckCircle,
    Award,
    Wrench
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Title */}
          <div className="mb-6">
            <h1 className="font-heading font-bold text-4xl lg:text-6xl text-foreground mb-4 leading-tight">
              <span className="text-primary">{hero.title}</span>
            </h1>
            <p className="font-heading font-semibold text-xl lg:text-2xl text-accent opacity-90 mb-2">
              {hero.subtitle}
            </p>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {hero.badges.map((badge, index) => {
              const IconComponent = iconMap[badge.icon];
              return (
                <Badge 
                  key={index}
                  variant="outline"
                  className="bg-primary-light dark:bg-primary-light border-primary/20 text-primary px-4 py-2 text-sm font-ui font-semibold"
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                  {badge.text}
                </Badge>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto group"
              >
                {hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="secondary"
                size="lg"
                className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto"
              >
                {hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {hero.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading font-bold text-3xl text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted font-ui">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;