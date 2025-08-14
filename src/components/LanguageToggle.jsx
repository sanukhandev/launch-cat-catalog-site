import React, { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useI18n } from "../context/I18nContext";

const LanguageToggle = () => {
  const {
    currentLanguage,
    currentCurrency,
    languages,
    currencies,
    changeLanguage,
    changeCurrency,
    t,
    isRTL,
  } = useI18n();

  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages[currentLanguage];
  const currentCurr = currencies[currentCurrency];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label={t("common.changeLanguage")}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">
          {currentLang.flag} {currentLang.nativeName}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentCurr.code}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className={`absolute top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-64 ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="p-4">
              {/* Language Section */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t("common.language")}
                </h3>
                <div className="space-y-1">
                  {Object.values(languages).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        currentLanguage === lang.code
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <div
                        className={`flex-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs opacity-75">{lang.name}</div>
                      </div>
                      {currentLanguage === lang.code && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t("common.currency")}
                </h3>
                <div className="space-y-1">
                  {Object.values(currencies).map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        changeCurrency(currency.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        currentCurrency === currency.code
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-lg font-bold">
                        {currency.symbol}
                      </span>
                      <div
                        className={`flex-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs opacity-75">
                          {currency.name}
                        </div>
                      </div>
                      {currentCurrency === currency.code && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageToggle;
