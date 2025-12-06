export interface VariantImage {
  id: number;
  url: string;
  alternativeText?: string;
}

export interface Variant {
  id: number;
  name: string | null;
  sku: string;
  price: number | null;
  stock: number;
  size: string;
  colour: string;
  images?: VariantImage[] | null;
}

export interface Product {
  id: number;
  title: string;
  description: { type: string; children: { text: string }[] }[];
  price: number;
  material: string;
  images: VariantImage[];
  variants: Variant[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    let allProducts: Product[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      // Fetch main product data
      const resProducts = await fetch(
        `http://localhost:1337/api/products?populate=*&pagination[page]=${page}&pagination[pageSize]=25`
      );
      const productsData = await resProducts.json();

      // Fetch variant data separately to get images
      const resVariants = await fetch(
        `http://localhost:1337/api/products?populate[0]=variants&populate[1]=variants.images&pagination[page]=${page}&pagination[pageSize]=25`
      );
      const variantsData = await resVariants.json();

      // Merge variant images into main products
      const mergedProducts: Product[] = productsData.data.map((product: any) => {
        const variantInfo = variantsData.data.find((v: any) => v.id === product.id);

        const productImages: VariantImage[] = product.images.length
          ? product.images
          : variantInfo?.variants?.flatMap((v: Variant) => v.images || []) || [];

        return {
          ...product,
          images: productImages,
        };
      });

      allProducts = [...allProducts, ...mergedProducts];

      page++;
      totalPages = productsData.meta.pagination.pageCount;
    } while (page <= totalPages);

    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
