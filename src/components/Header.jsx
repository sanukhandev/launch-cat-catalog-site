import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ThemeToggle from "./ThemeToggle";
import { useConfig } from "../hooks/useConfig";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { getBrand, getCompany, getNavigation } = useConfig();

  const brand = getBrand();
  const company = getCompany();
  const navigation = getNavigation();

  const isActiveLink = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock search functionality - would navigate to search results
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="border-b border-primary-foreground/20 py-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{company.phone}</span>
              </div>
              <span className="hidden sm:block">
                {company.workingHours.join(" | ")}
              </span>
            </div>
            <div className="text-xs opacity-90">{brand.tagline}</div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt={brand.logoText}
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.menu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-md font-ui font-semibold text-sm uppercase tracking-wide transition-colors ${
                    isActiveLink(item.path)
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search & CTA */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle variant="ghost" />

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center relative"
              >
                <Input
                  type="text"
                  placeholder="Search products, SKUs…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 p-1 h-8 w-8 text-white hover:bg-white/20"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>

              {/* CTA Button */}
              <Button
                variant="secondary"
                className="hidden sm:inline-flex bg-accent text-white hover:bg-accent-dark font-ui font-semibold text-sm uppercase tracking-wide"
              >
                Enquire Now
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-foreground/20 py-4">
            <nav className="flex flex-col gap-2">
              {navigation.menu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-3 rounded-md font-ui font-semibold text-sm uppercase tracking-wide transition-colors ${
                    isActiveLink(item.path)
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile search */}
            <form
              onSubmit={handleSearch}
              className="mt-4 flex items-center relative"
            >
              <Input
                type="text"
                placeholder="Search products, SKUs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 p-1 h-8 w-8 text-white hover:bg-white/20"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>

            <Button
              variant="secondary"
              className="mt-3 w-full bg-accent text-white hover:bg-accent-dark font-ui font-semibold text-sm uppercase tracking-wide"
            >
              Enquire Now
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
