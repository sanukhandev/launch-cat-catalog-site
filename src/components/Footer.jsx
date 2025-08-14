import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

const Footer = () => {
  const { getBrand, getCompany, getFooter, getCategories } = useConfig();
  const brand = getBrand();
  const company = getCompany();
  const footer = getFooter();
  const categories = getCategories();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-2">
                <div className="text-primary font-bold text-lg">{brand.logoText}</div>
              </div>
              <div>
                <div className="font-heading font-bold text-lg">{brand.distributor}</div>
                <div className="text-xs opacity-90">Launch MENA Distributor</div>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              {brand.tagline}
            </p>
            <p className="text-sm opacity-75 leading-relaxed">
              {footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footer.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Product Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              
              {/* Main Office */}
              <div>
                <h4 className="font-ui font-semibold text-sm mb-2 opacity-95">Main Office</h4>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{company.hq}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href={`tel:${company.phone}`} className="hover:underline">
                      {company.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      {company.workingHours.map((hours, index) => (
                        <div key={index}>{hours}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Showroom */}
              <div>
                <h4 className="font-ui font-semibold text-sm mb-2 opacity-95">Showroom</h4>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{company.showroom.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href={`tel:${company.showroom.phone}`} className="hover:underline">
                      {company.showroom.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{company.showroom.hours[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-75">
              {footer.copyright}
            </p>
            <div className="flex items-center gap-4 text-sm opacity-75">
              {footer.legalLinks.map((link) => (
                <Link key={link.name} to={link.path} className="hover:opacity-100 hover:underline">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;