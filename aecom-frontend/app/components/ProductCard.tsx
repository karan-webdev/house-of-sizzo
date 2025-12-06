"use client";

import React from "react";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  slug?: string;
}

export default function ProductCard({ id, title, price, imageUrl, slug }: ProductCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${slug || id}`}>
        <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-2">{title}</h2>
          <p className="text-blue-600 font-bold">${price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}
