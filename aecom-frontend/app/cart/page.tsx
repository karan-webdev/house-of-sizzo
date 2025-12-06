"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Pass the entire cart with SKU included
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            variantId: item.variantId,
            title: item.title,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            sku: item.sku, // ⭐ SKU is passed here
          })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 px-6 py-2 bg-[#8499b8] text-white rounded hover:bg-[#6f86a4]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.variantId}`}
            className="flex items-center gap-4 p-4 rounded-lg"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-24 h-24 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.variantName}</p>
              <p className="text-xs text-gray-400">SKU: {item.sku}</p>
              <p className="text-lg font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id, item.variantId)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/products")}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-all
              ${loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#8499b8] hover:bg-[#6f86a4] cursor-pointer"}`}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>

        <button
          onClick={clearCart}
          className="w-full mt-4 px-6 py-2 text-red-500 hover:text-red-700 underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}