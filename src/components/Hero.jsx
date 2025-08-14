import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useConfig } from "../hooks/useConfig";

const Hero = () => {
  const { getProducts } = useConfig();
  const products = getProducts().slice(0, 6); // Show only first 6 products

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      setIsUserInteracting(true);
      emblaApi.scrollPrev();
      setTimeout(() => setIsUserInteracting(false), 5000); // Resume auto-scroll after 5 seconds
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      setIsUserInteracting(true);
      emblaApi.scrollNext();
      setTimeout(() => setIsUserInteracting(false), 5000); // Resume auto-scroll after 5 seconds
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-scroll functionality
    const autoScroll = setInterval(() => {
      if (emblaApi && !isUserInteracting) {
        emblaApi.scrollNext();
      }
    }, 4000);

    // Pause auto-scroll on mouse enter, resume on mouse leave
    const emblaContainer = emblaApi.containerNode();
    if (emblaContainer) {
      const handleMouseEnter = () => setIsUserInteracting(true);
      const handleMouseLeave = () => setIsUserInteracting(false);

      emblaContainer.addEventListener("mouseenter", handleMouseEnter);
      emblaContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearInterval(autoScroll);
        emblaContainer.removeEventListener("mouseenter", handleMouseEnter);
        emblaContainer.removeEventListener("mouseleave", handleMouseLeave);
      };
    }

    return () => {
      clearInterval(autoScroll);
    };
  }, [emblaApi, onSelect, isUserInteracting]);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground mb-3">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Professional automotive diagnostic solutions and equipment for
              workshops and service centers
            </p>
          </div>

          {/* Product Carousel */}
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex-none w-72 md:w-80">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.inStock ? (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              In Stock
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 truncate">
                            {product.title}
                          </h3>
                          <p
                            className="text-muted text-sm mb-3 overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.shortDescription}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-primary">
                              ${product.price}
                            </div>
                            <Link to={`/products/${product.slug}`}>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary-dark text-white"
                              >
                                View Details
                                <ArrowRight className="w-3 h-3 ml-1" />
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
          <div className="text-center mt-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide px-6 py-2 h-auto group"
                >
                  Browse All Products
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide px-6 py-2 h-auto"
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
