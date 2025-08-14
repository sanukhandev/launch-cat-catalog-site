import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useConfig } from '../hooks/useConfig';

const Hero = () => {
  const { getProducts } = useConfig();
  const products = getProducts().slice(0, 6); // Show only first 6 products

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      skipSnaps: false,
      dragFree: true
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              Professional automotive diagnostic solutions and equipment for workshops and service centers
            </p>
          </div>

          {/* Product Carousel */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {products.map((product) => (
                  <div key={product.id} className="flex-none w-80 md:w-96">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.inStock ? (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              In Stock
                            </div>
                          ) : (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-2 truncate">{product.title}</h3>
                          <p className="text-muted text-sm mb-4 overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>{product.shortDescription}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-primary">
                              ${product.price}
                            </div>
                            <Link to={`/products/${product.slug}`}>
                              <Button size="sm" className="bg-primary hover:bg-primary-dark text-white">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl z-10"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl z-10"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto group"
                >
                  Browse All Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="secondary"
                  size="lg"
                  className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;