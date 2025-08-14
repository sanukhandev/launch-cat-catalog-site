import React, { createContext, useContext, useEffect, useState } from "react";

// Supported languages and currencies
export const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    flag: "🇺🇸",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    flag: "🇸🇦",
  },
};

export const CURRENCIES = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 1,
  },
  AED: {
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    rate: 3.67,
  },
  SAR: {
    code: "SAR",
    symbol: "ر.س",
    name: "Saudi Riyal",
    rate: 3.75,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    rate: 0.85,
  },
};

// Country to language/currency mapping
export const COUNTRY_MAPPINGS = {
  AE: { language: "ar", currency: "AED" }, // UAE
  SA: { language: "ar", currency: "SAR" }, // Saudi Arabia
  US: { language: "en", currency: "USD" }, // USA
  GB: { language: "en", currency: "USD" }, // UK
  DE: { language: "en", currency: "EUR" }, // Germany
};

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  // Detect user's location and set defaults
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Try to get user's country from browser
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const countryCode = data.country_code;

        if (COUNTRY_MAPPINGS[countryCode]) {
          const mapping = COUNTRY_MAPPINGS[countryCode];
          setCurrentLanguage(mapping.language);
          setCurrentCurrency(mapping.currency);
        }
      } catch (error) {
        console.log("Could not detect location, using defaults");
      }
    };

    // Check localStorage first
    const savedLanguage = localStorage.getItem("language");
    const savedCurrency = localStorage.getItem("currency");

    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    } else {
      detectUserLocation();
    }

    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/locales/${currentLanguage}.json`);
        const translationData = await response.json();
        setTranslations(translationData);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English
        if (currentLanguage !== "en") {
          const fallbackResponse = await fetch("/locales/en.json");
          const fallbackData = await fallbackResponse.json();
          setTranslations(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Update document direction and language
  useEffect(() => {
    const language = LANGUAGES[currentLanguage];
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;

    // Add RTL class for styling
    if (language.dir === "rtl") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem("language", languageCode);
    }
  };

  const changeCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setCurrentCurrency(currencyCode);
      localStorage.setItem("currency", currencyCode);
    }
  };

  // Translation function
  const t = (key, defaultValue = key) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return typeof value === "string" ? value : defaultValue;
  };

  // Currency formatting function
  const formatPrice = (price, showSymbol = true) => {
    const currency = CURRENCIES[currentCurrency];
    const convertedPrice = price * currency.rate;
    const formattedPrice = convertedPrice.toLocaleString(currentLanguage, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (showSymbol) {
      return currentLanguage === "ar"
        ? `${formattedPrice} ${currency.symbol}`
        : `${currency.symbol}${formattedPrice}`;
    }

    return formattedPrice;
  };

  const value = {
    currentLanguage,
    currentCurrency,
    languages: LANGUAGES,
    currencies: CURRENCIES,
    changeLanguage,
    changeCurrency,
    t,
    formatPrice,
    loading,
    isRTL: LANGUAGES[currentLanguage]?.dir === "rtl",
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
