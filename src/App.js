import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./context/I18nContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/category/:slug" element={<Products />} />
              <Route path="/about" element={<Home />} />
              <Route path="/accessories" element={<Products />} />
              <Route path="/training" element={<Contact />} />
              <Route path="/support" element={<Contact />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
