'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";

interface ProductVariant {
  id: number;
  name: string | null;
  sku: string;
  price: number | null;
  stock: number;
  size?: string;
  colour?: string;
  images?: { id: number; url: string; alternativeText?: string }[];
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  material?: string;
  slug: string;
  images: { url: string; alt: string }[];
  variants: ProductVariant[];
}

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { cart, addToCart, updateQuantity, getCartItemQty } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<{ url: string; alt: string } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [quantity, setQuantity] = useState(1);

  const cartQuantity = selectedVariant ? getCartItemQty(product?.id || 0, selectedVariant.id) : 0;
  const isInCart = cartQuantity > 0;

  useEffect(() => {
    if (selectedVariant && product) {
      const qty = getCartItemQty(product.id, selectedVariant.id);
      setQuantity(qty > 0 ? qty : 1);
    }
  }, [selectedVariant, product, getCartItemQty, cart]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let allProducts: any[] = [];
        let allVariants: any[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const resProducts = await fetch(
            `https://leading-pleasure-696b0f5d25.strapiapp.com/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=50`
          );
          const productsData = await resProducts.json();

          const resVariants = await fetch(
            `https://leading-pleasure-696b0f5d25.strapiapp.com/api/products?populate[0]=variants&populate[1]=variants.images&pagination[page]=${page}&pagination[pageSize]=50`
          );
          const variantsData = await resVariants.json();

          allProducts = allProducts.concat(productsData.data);
          allVariants = allVariants.concat(variantsData.data);

          totalPages = productsData.meta.pagination.pageCount;
          page++;
        } while (page <= totalPages);

        const mappedProducts: Product[] = allProducts.map((item: any) => {
          const attrs = item.attributes || item;
          const variantInfo = allVariants.find((v: any) => v.id === item.id);

          let variantsFromInfo = [];
          if (variantInfo?.attributes?.variants) {
            variantsFromInfo = variantInfo.attributes.variants;
          } else if (variantInfo?.variants) {
            variantsFromInfo = variantInfo.variants;
          } else if (attrs.variants) {
            variantsFromInfo = attrs.variants;
          }

          const variants: ProductVariant[] = variantsFromInfo.map((v: any) => {
            let images = [];
            
            if (Array.isArray(v.images)) {
              images = v.images.map((img: any) => ({
                id: img.id,
                url: img.url?.startsWith("http")
                  ? img.url
                  : `https://leading-pleasure-696b0f5d25.strapiapp.com${img.url || ''}`,
                alternativeText: img.alternativeText || "",
              }));
            } else if (v.images?.data) {
              images = v.images.data.map((img: any) => ({
                id: img.id,
                url: img.attributes.url.startsWith("http")
                  ? img.attributes.url
                  : `https://leading-pleasure-696b0f5d25.strapiapp.com${img.attributes.url}`,
                alternativeText: img.attributes.alternativeText || "",
              }));
            }

            return {
              id: v.id,
              name: v.name,
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              size: v.size,
              colour: v.colour,
              images: images,
            };
          });

          const allImages = variants.flatMap(v => 
            v.images?.map(img => ({
              url: img.url,
              alt: img.alternativeText || attrs.title
            })) || []
          );

          return {
            id: item.id,
            title: attrs.title,
            description:
              attrs.description
                ?.map((p: any) => p.children.map((c: any) => c.text).join(" "))
                .join(" ") || "",
            price: attrs.price,
            material: attrs.material,
            slug: attrs.slug || item.id.toString(),
            images: allImages,
            variants: variants,
          };
        });

        setProducts(mappedProducts);

        const found = mappedProducts.find(
          (p) =>
            p.slug?.toLowerCase() === slug?.toLowerCase() ||
            p.variants.some((v) => v.sku?.toLowerCase() === slug?.toLowerCase())
        );

        setProduct(found || null);

        if (found) {
          if (found.images.length > 0) {
            setMainImage(found.images[0]);
          }
          if (found.variants.length > 0) {
            setSelectedVariant(found.variants[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [slug]);

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading product...</p>;

  if (!product)
    return <p className="text-center mt-20 text-gray-500">Product not found.</p>;

  const changeQuantity = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    
    if (selectedVariant && isInCart) {
      updateQuantity(product.id, selectedVariant.id, newQty);
    }
  };

  const handleVariantClick = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    
    if (variant.images && variant.images.length > 0) {
      setMainImage({
        url: variant.images[0].url,
        alt: variant.images[0].alternativeText || product.title
      });
    }
    
    const qty = getCartItemQty(product.id, variant.id);
    setQuantity(qty > 0 ? qty : 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const variantName = [selectedVariant.size, selectedVariant.colour]
      .filter(Boolean)
      .join(" - ") || selectedVariant.name || selectedVariant.sku;

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantName: variantName,
      price: selectedVariant.price || product.price,
      quantity: quantity,
      imageUrl: mainImage?.url || "",
      sku: selectedVariant.sku,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={mainImage.alt || product.title}
              className="w-full h-96 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
              No Image
            </div>
          )}

          {product.images.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={`${img.url}-${index}`}
                  src={img.url}
                  alt={img.alt || product.title}
                  className={`w-20 h-20 object-cover rounded border-2 cursor-pointer transition-all
                    ${mainImage?.url === img.url ? 'border-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-gray-700">{product.description}</p>
            <p className="text-lg font-semibold">
              Price: ${(selectedVariant?.price || product.price).toFixed(2)}
            </p>
            {product.material && (
              <p className="text-gray-600">Material: {product.material}</p>
            )}
          </div>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Select Variant:</h3>
              <div className="space-y-2">
                {product.variants.map((v) => {
                  const variantQty = getCartItemQty(product.id, v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariantClick(v)}
                      className={`w-full cursor-pointer flex items-center justify-between border-2 rounded-lg p-3 transition-all
                        ${selectedVariant?.id === v.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        {v.images && v.images.length > 0 && (
                          <img
                            src={v.images[0].url}
                            alt={v.images[0].alternativeText || product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="text-left">
                          <span className="font-medium block">
                            {v.size && v.colour
                              ? `${v.size} - ${v.colour}`
                              : v.size || v.colour || v.name || v.sku}
                          </span>
                          {variantQty > 0 && (
                            <span className="text-xs text-blue-600">
                              {variantQty} in cart
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold">
                        ${v.price?.toFixed(2) || product.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-6">
            <span className="font-semibold">Quantity:</span>
            <button
              onClick={() => changeQuantity(quantity - 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              -
            </button>
            <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
            <button
              onClick={() => changeQuantity(quantity + 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            disabled={isInCart}
            onClick={handleAddToCart}
            className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition-all
              ${isInCart 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#8499b8] hover:bg-[#6f86a4] cursor-pointer"}`}
          >
            {isInCart ? "✓ Item Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
