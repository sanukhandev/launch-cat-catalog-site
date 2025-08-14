import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock } from "lucide-react";
import { useConfig } from "../hooks/useConfig";
import { useCategories } from "../hooks/useCategories";
import { useI18n } from "../context/I18nContext";

const Footer = () => {
  const { getBrand, getCompany, getFooter } = useConfig();
  const { getFeaturedCategories } = useCategories();
  const { t, currentLanguage } = useI18n();
  const brand = getBrand();
  const company = getCompany();
  const footer = getFooter();
  const categories = getFeaturedCategories();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Main Logo */}
              <div className="bg-white rounded-lg p-3 shadow-md">
                <div className="text-primary font-heading font-black text-2xl tracking-wide">
                  {t("brand.logoText")}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-heading font-bold text-xl text-white mb-1">
                {t("brand.distributor")}
              </div>
              <div className="text-sm opacity-90 mb-3">
                {t("brand.tagline")}
              </div>
            </div>
            <p className="text-sm opacity-75 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.products")}
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.accessories")}
                </Link>
              </li>
              <li>
                <Link
                  to="/training"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.training")}
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.support")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                >
                  {t("footer.links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.categories")}
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => {
                // Use translated category name from useCategories hook
                const categoryName = category.translatedName || category.name;

                return (
                  <li key={category.id}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-sm opacity-90 hover:opacity-100 hover:underline transition-opacity"
                    >
                      {categoryName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.contactInfo")}
            </h3>
            <div className="space-y-3">
              {/* Main Office */}
              <div>
                <h4 className="font-ui font-semibold text-sm mb-2 opacity-95">
                  {t("contact.mainOffice")}
                </h4>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{company.hq}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`tel:${company.phone}`}
                      className="hover:underline"
                    >
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
                <h4 className="font-ui font-semibold text-sm mb-2 opacity-95">
                  {t("contact.showroom")}
                </h4>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{company.showroom.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`tel:${company.showroom.phone}`}
                      className="hover:underline"
                    >
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
            <p className="text-sm opacity-75">{t("footer.copyright")}</p>
            <div className="flex items-center gap-4 text-sm opacity-75">
              <Link to="/privacy" className="hover:opacity-100 hover:underline">
                {t("footer.legalLinks.privacy")}
              </Link>
              <Link to="/terms" className="hover:opacity-100 hover:underline">
                {t("footer.legalLinks.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
