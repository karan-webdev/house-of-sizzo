"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  variantId: number;
  title: string;
  variantName: string;
  price: number;
  imageUrl: string;
  quantity: number;
  sku: string; // ⭐ Make sure SKU is included
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: number, variantId: number, qty: number) => void;
  removeFromCart: (id: number, variantId: number) => void;
  clearCart: () => void;
  getCartItemQty: (id: number, variantId: number) => number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.variantId === item.variantId);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (id: number, variantId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, variantId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.variantId === variantId
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeFromCart = (id: number, variantId: number) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.variantId === variantId)));
  };

  const getCartItemQty = (id: number, variantId: number) => {
    const item = cart.find(i => i.id === id && i.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;