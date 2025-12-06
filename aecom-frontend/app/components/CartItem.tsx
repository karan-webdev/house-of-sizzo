"use client";

import React from "react";

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onRemove: (id: number) => void;
}

export default function CartItem({ id, title, price, quantity, imageUrl, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <img src={imageUrl} alt={title} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p>
          {quantity} x ${price.toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}
