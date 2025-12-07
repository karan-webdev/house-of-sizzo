"use client";

import React, { useEffect, useState } from "react";
import HeroBanner from "./components/HeroBanner";
import ProductList from "./components/ProductList";

interface Product {
  id: number;
  title: string;
  price: number;
  slug: string;
  images: { url: string }[];
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://leading-pleasure-696b0f5d25.strapiapp.com/api/products?populate=images") // adjust URL if needed
      .then((res) => res.json())
      .then((data) => setProducts(data.data.map((item: any) => ({
        id: item.id,
        title: item.attributes.title,
        price: item.attributes.price,
        slug: item.attributes.slug,
        images: item.attributes.images.data.map((img: any) => ({
          url: img.attributes.url,
        })),
      }))))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner/>

      {/* Featured Products */}
      {/* <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <ProductList products={products} />
      </section> */}
    </div>
  );
}
