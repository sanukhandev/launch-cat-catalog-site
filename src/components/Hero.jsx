import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useProducts } from "../hooks/useProducts";
import { useI18n } from "../context/I18nContext";

const Hero = () => {
  const { products, loading, error } = useProducts();
  const { t, formatPrice, isRTL } = useI18n();
  const displayProducts = products.slice(0, 6); // Show only first 6 products

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
              {t("hero.featuredProducts")}
            </h2>
            <p className="text-base text-muted max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
          </div>

          {/* Product Carousel */}
          <div className="relative">
            {loading ? (
              <div className="flex gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-none w-72 md:w-80">
                    <Card className="h-full">
                      <CardContent className="p-0">
                        <div className="bg-gray-200 h-40 rounded-t-lg animate-pulse"></div>
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  {t("common.errorLoadingProducts", "Error loading products")}
                </p>
                <Button onClick={() => window.location.reload()}>
                  {t("common.retry", "Retry")}
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                  {displayProducts.map((product) => (
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
                                {formatPrice(product.price)}
                              </div>
                              <Link to={`/products/${product.slug}`}>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary-dark text-white"
                                >
                                  {t("common.viewDetails")}
                                  <ArrowRight
                                    className={`w-3 h-3 ${
                                      isRTL ? "mr-1" : "ml-1"
                                    }`}
                                  />
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
            )}

            {/* Navigation Buttons */}
            {!loading && !error && displayProducts.length > 0 && (
              <>
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
              </>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide px-6 py-2 h-auto group"
                >
                  {t("common.browseAllProducts")}
                  <ArrowRight
                    className={`w-4 h-4 ${
                      isRTL ? "mr-2" : "ml-2"
                    } group-hover:${
                      isRTL ? "-translate-x-1" : "translate-x-1"
                    } transition-transform`}
                  />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-accent hover:bg-accent-dark text-white font-ui font-semibold text-sm uppercase tracking-wide px-6 py-2 h-auto"
                >
                  {t("common.contactSales")}
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
