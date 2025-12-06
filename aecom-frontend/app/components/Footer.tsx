'use client';

import React, { useState, useEffect } from "react";
import { getSiteSettings } from "../lib/getSiteSettings";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [settings, setSettings] = useState<{ siteName: string; logo: string | null } | null>(null);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(""); // for our styled alert

  useEffect(() => {
    async function loadSettings() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000); // hide after 3 seconds
  };

  const handleSubscribe = () => {
    if (!email) return showToast("Please enter a valid email");
    showToast("This feature is currently not available");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 relative">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          {settings?.logo && (
            <div className="bg-white rounded-full p-2 w-max mb-4 flex items-center justify-center">
              <img src={settings.logo} alt="Logo" className="w-24 h-24 object-contain" />
            </div>
          )}
          <p className="text-gray-400">
            {settings?.siteName || "Our Store"} brings you curated homeware and lifestyle products to elevate your space.
          </p>
          <div className="mt-4">
            <a
              href="#"
              onClick={() => showToast("This feature is currently not available")}
              className="text-gray-400 hover:text-white block cursor-pointer"
            >
              support@houseofsizzo.com.au
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li>
              <a
                href="https://www.instagram.com/houseofsizzo?igsh=MWJneWllamNvNG5mYQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1CwnuH8Uog/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white"
              >
                <FaFacebookF /> Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/shipping" className="hover:text-white">Shipping & Returns</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
            <li>
              <a
                href="#"
                onClick={() => showToast("This feature is currently not available")}
                className="hover:text-white cursor-pointer"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">Subscribe to our newsletter</h3>
          <p className="text-gray-400 mb-3">Get the latest updates and offers.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here..."
            className="w-full p-3 rounded border bg-white border-gray-600 text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-[#E0E0E0]"
          />
          <button
            onClick={handleSubscribe}
            className="w-full bg-[#8499b8] hover:bg-[#6f86a4] text-white py-3 rounded transition font-semibold cursor-pointer"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-700 py-6 text-center text-white text-sm">
        &copy; {new Date().getFullYear()} {settings?.siteName || "Our Store"}. All rights reserved.
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#8499b8] text-white px-6 py-3 rounded shadow-lg animate-slide-up">
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
}
