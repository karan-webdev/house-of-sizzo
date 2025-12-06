"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { getSiteSettings } from "../lib/getSiteSettings";
import { fetchProducts, Product } from "../lib/fetchProducts";
import { useRouter } from "next/navigation";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [settings, setSettings] = useState<{ siteName: string; logo: string | null } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const bannerTexts = [
    "Treat Your Home",
    "Make Your Home Yours",
    "Curated Comforts",
    "Every Detail Matters",
    "Home, Elevated",
    "Love Where You Live",
  ];

  // Banner rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Load site settings
  useEffect(() => {
    async function loadSettings() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  // Suggestions
  useEffect(() => {
    if (!searchTerm.trim()) return setSuggestions([]);
    const filtered = products
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [searchTerm, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close cart on outside click
  useEffect(() => {
    const handleClickOutsideCart = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };
    if (cartOpen) document.addEventListener("mousedown", handleClickOutsideCart);
    return () => document.removeEventListener("mousedown", handleClickOutsideCart);
  }, [cartOpen]);

  const goToProduct = (product: Product) => {
    const slug =
      product.variants[0]?.sku?.toLowerCase() ||
      product.title.toLowerCase().replace(/\s+/g, "-");
    router.push(`/product/${slug}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Banner */}
      <div className="w-full bg-[#8498b8] text-white text-center font-medium text-sm md:text-base h-10 flex items-center justify-center relative overflow-hidden">
        {bannerTexts.map((text, i) => (
          <span
            key={i}
            className={`absolute transition-opacity duration-1000 ${
              i === bannerIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {text}
          </span>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 relative">

        {/* Top Row: Logo + Nav/Cart */}
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 h-16">
            {settings?.logo && (
              <img
                src={settings.logo}
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            )}
            <span className="site-heading text-2xl font-bold ml-2">
              {settings?.siteName || "Loading..."}
            </span>
          </Link>

          <div
          ref={searchRef}
          className="w-full hidden md:block md:w-[500px] mx-auto relative z-30"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Find your perfect homeware…"
            className="w-full rounded border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#E0E0E0] p-[15px] pr-12"
          />

          {/* Search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A2D24"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => goToProduct(s)}
                >
                  {s.title}
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Nav + Cart */}
          <nav className="flex gap-6 items-center">
            <Link href="/products" className="hover:text-[#8498b8]">
              Products
            </Link>
            <button onClick={() => setCartOpen(!cartOpen)} className="relative z-[60] cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2A2D24"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Row: Search */}
        <div
          ref={searchRef}
          className="w-full md:w-[500px] block md:hidden mx-auto relative z-30"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Find your perfect homeware…"
            className="w-full rounded border border-[#2A2D24] focus:outline-none focus:ring-2 focus:ring-[#8499b8] p-[15px] pr-12"
          />

          {/* Search icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A2D24"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => goToProduct(s)}
                >
                  {s.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Drawer */}
        {cartOpen && (
          <div
            ref={cartRef}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 z-[70] overflow-auto"
          >
            <h2 className="text-xl font-bold mb-4">Cart</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variantId}`} className="flex items-start gap-3 mb-6 border-b pb-4">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.variantName}</p>
                      <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.variantId, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 border rounded cursor-pointer"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                          className="px-2 py-1 border rounded cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.variantId)}
                        className="text-red-500 text-xs underline mt-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <Link
                  href="/cart"
                  className="mt-4 block px-4 py-2 bg-[#8499b8] hover:bg-[#6f86a4] text-white rounded text-center"
                >
                  Go to Checkout
                </Link>
              </>
            )}

            <button
              onClick={() => setCartOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </header>
    </>
  );
}
