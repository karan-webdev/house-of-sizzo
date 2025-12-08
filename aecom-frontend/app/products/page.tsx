'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchProducts, Product } from '../lib/fetchProducts';
import { useRouter } from 'next/navigation';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxTitleHeight, setMaxTitleHeight] = useState<number>(0);

  const router = useRouter();
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const [filters, setFilters] = useState({
    category: '',
    material: '',
    color: '',
    minPrice: 0,
    maxPrice: 0,
    sort: 'default' as 'default' | 'priceAsc' | 'priceDesc',
  });

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);

      const prices = data.map(p => p.price);
      setFilters(prev => ({
        ...prev,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      }));

      setLoading(false);
    };
    getProducts();
  }, []);

  // Initialize filters from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(prev => ({
      ...prev,
      category: params.get('category') || '',
      material: params.get('material') || '',
      color: params.get('color') || '',
      sort: (params.get('sort') as 'default' | 'priceAsc' | 'priceDesc') || 'default',
    }));
  }, []);

  // Update URL whenever filters change
  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.category) query.set('category', filters.category);
    if (filters.material) query.set('material', filters.material);
    if (filters.color) query.set('color', filters.color);
    if (filters.sort && filters.sort !== 'default') query.set('sort', filters.sort);

    router.replace(`/products?${query.toString()}`, { scroll: false });
  }, [filters]);

  // Filter products
  useEffect(() => {
    let result = products.filter(product => {
      // @ts-ignore
      const matchesCategory = filters.category ? product.category?.name === filters.category : true;
      const matchesMaterial = filters.material ? product.material === filters.material : true;
      const matchesColor = filters.color
        ? product.variants.some(v => v.colour === filters.color)
        : true;
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

      return matchesCategory && matchesMaterial && matchesColor && matchesPrice;
    });

    if (filters.sort === 'priceAsc') result = result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'priceDesc') result = result.sort((a, b) => b.price - a.price);

    setFilteredProducts(result);
  }, [filters, products]);

  // Measure tallest title
  useEffect(() => {
    const heights = titleRefs.current.filter(el => el !== null).map(el => el!.offsetHeight);
    if (heights.length > 0) {
      const tallest = Math.max(...heights);
      setMaxTitleHeight(tallest);
    }
  }, [filteredProducts]);

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading products...</p>;
  // @ts-ignore
  const categories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));
  const materials = Array.from(new Set(products.map(p => p.material).filter(Boolean)));
  const colors = Array.from(
    new Set(
      products
        // @ts-ignore
        .filter(p => (filters.category ? p.category?.name === filters.category : true))
        .flatMap(p => p.variants.map(v => v.colour))
        .filter(Boolean)
    )
  );

  const goToProduct = (product: Product) => {
    const slug =
      product.variants[0]?.sku?.toLowerCase() ||
      product.title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      <div className="flex flex-col mb-8 md:flex-row gap-8">
        {/* FILTERS */}
        <aside className="md:w-64 w-full">
          <div className="bg-white rounded p-4 border border-[#E0E0E0] sticky top-6 flex flex-col h-[80vh]">
            {/* Sort */}
            <div className="mb-4">
              <label className="font-semibold mb-1 block">Sort By</label>
              <select
                value={filters.sort}
                onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                className="w-full px-2 py-1 rounded border-gray-200 bg-gray-50"
              >
                <option value="default">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="font-semibold mb-1 block">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-2 py-1 rounded border-gray-200 bg-gray-50"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Scrollable Material & Color */}
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-1">
              {/* Material */}
              <div>
                <span className="font-semibold mb-1 block">Material</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="material"
                    value=""
                    checked={filters.material === ''}
                    onChange={() => setFilters(prev => ({ ...prev, material: '' }))}
                  />
                  All Materials
                </label>
                {materials.map(m => (
                  <label key={m} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="material"
                      value={m}
                      checked={filters.material === m}
                      onChange={e => setFilters(prev => ({ ...prev, material: e.target.value }))}
                    />
                    {m}
                  </label>
                ))}
              </div>

              {/* Color */}
              <div>
                <span className="font-semibold mb-1 block">Color</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="color"
                    value=""
                    checked={filters.color === ''}
                    onChange={() => setFilters(prev => ({ ...prev, color: '' }))}
                  />
                  All Colors
                </label>
                {colors.map(c => (
                  <label key={c} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="color"
                      value={c}
                      checked={filters.color === c}
                      onChange={e => setFilters(prev => ({ ...prev, color: e.target.value }))}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[1fr] items-start">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 mt-10">
                Oops! No products match your filters.
              </p>
            ) : (
              filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="rounded border border-[#E0E0E0] transition cursor-pointer overflow-hidden flex flex-col h-full group"
                  onClick={() => goToProduct(product)}
                >
                  {/* Image */}
                  <div className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images.length ? (
                      <img
                        src={
                          product.images[0].url.startsWith('http')
                            ? product.images[0].url
                            : `https://leading-pleasure-696b0f5d25.strapiapp.com${product.images[0].url}`
                        }
                        alt={product.images[0].alternativeText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h2
                      // @ts-ignore
                      ref={el => (titleRefs.current[idx] = el)}
                      className="text-lg font-semibold line-clamp-2 transition-colors group-hover:text-[#8499b8]"
                      style={{ minHeight: maxTitleHeight ? `${maxTitleHeight}px` : 'auto' }}
                    >
                      {product.title}
                    </h2>

                    <p className="text-gray-700 font-medium mt-4">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
