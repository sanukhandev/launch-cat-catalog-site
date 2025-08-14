import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Phone, MapPin, Award, Users, Wrench, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useConfig } from '../hooks/useConfig';

const Home = () => {
  const { getCategories, getCompany, getBrand, getAbout } = useConfig();
  const categories = getCategories();
  const company = getCompany();
  const brand = getBrand();
  const about = getAbout();

  const iconMap = {
    Award,
    Users,
    Wrench,
    CheckCircle
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-foreground mb-4">
              {about.heading}
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-6">
              {about.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <Card key={index} className="text-center p-6 border border-border hover:shadow-md transition-shadow dark:bg-gray-800">
                  <CardContent className="p-0">
                    {IconComponent && <IconComponent className="w-12 h-12 text-primary mx-auto mb-4" />}
                    <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-foreground mb-4">
              Featured Categories
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Explore our comprehensive range of professional automotive diagnostic equipment and workshop tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {categories.slice(0, 7).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto group"
              >
                View All Products
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Distributor Strip */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading font-semibold text-3xl lg:text-4xl mb-4">
              Your Authorized Distributor
            </h2>
            <div className="font-heading font-bold text-4xl lg:text-5xl mb-6 text-white">
              {brand.distributor}
            </div>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Sales, training and after-sales support for Launch diagnostic solutions across UAE and MENA region
            </p>
            <Link to="/contact">
              <Button 
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 font-ui font-semibold text-sm uppercase tracking-wide px-8 py-3 h-auto"
              >
                Enquire Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-foreground mb-4">
              Visit Our Showroom
            </h2>
            <p className="text-lg text-muted">
              Experience our products firsthand at our state-of-the-art showroom facility
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Main Office */}
            <Card className="p-8 border border-border dark:bg-gray-800">
              <CardContent className="p-0">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-6">Main Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Address</p>
                      <p className="text-muted">{company.hq}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Phone</p>
                      <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                        {company.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Working Hours</p>
                      <div className="text-muted text-sm">
                        {company.workingHours.map((hours, index) => (
                          <div key={index}>{hours}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Showroom */}
            <Card className="p-8 border border-border bg-primary-light dark:bg-gray-700">
              <CardContent className="p-0">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-6">Showroom</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Address</p>
                      <p className="text-muted">{company.showroom.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Phone</p>
                      <a href={`tel:${company.showroom.phone}`} className="text-primary hover:underline">
                        {company.showroom.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-ui font-semibold text-foreground mb-1">Hours</p>
                      <p className="text-muted text-sm">{company.showroom.hours[0]}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;