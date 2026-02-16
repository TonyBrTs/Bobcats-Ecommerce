"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/Product";
import ProductCard from "@/components/Products/ProductCard";
import { API_ENDPOINTS } from "@/config/api";

/**
 * ProductosPage component for displaying a list of products based on selected category and subcategory.
 */
export default function ProductosPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const [products, setProducts] = useState<Product[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS);
        const data: Product[] = await res.json();

        const filtered = data.filter((product) => {
          return (
            product.categories?.includes(category) &&
            (!subcategory || product.subcategories?.includes(subcategory))
          );
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  // Function to handle product click and navigate to the product detail page
  function handleProductClick(product: Product) {
    router.push(`productos/productDetail/${product.id}`);
  }

  const formattedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Productos";
  const formattedSubcategory =
    subcategory && subcategory.length > 0
      ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
      : "";

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center">
        {category ? `Productos de ${formattedCategory}` : "Productos"}
      </h2>
      {subcategory && subcategory.trim() !== "" && (
        <h3 className="text-xl font-medium text-center mt-2">
          {`${formattedSubcategory}`}
        </h3>
      )}
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            onClick={() => {
              handleProductClick(product);
            }}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
