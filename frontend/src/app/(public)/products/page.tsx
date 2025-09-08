"use client";
import ProductCard from "@/shared/components/cards/ProductCard";
import { Product } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { getTrackBackground, Range } from "react-range";

const MIN = 0;
const MAX = 1199;
const STEP = 1;

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const Page = () => {
  const router = useRouter();

  const [isProductLoading, setIsProductLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1199]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [tempPriceRange, setTempPriceRange] = useState([MIN + 100, MAX - 180]);

  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("priceRange", priceRange.join(","));
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }
    if (selectedSizes.length > 0) {
      params.set("sizes", selectedSizes.join(","));
    }
    params.set("page", page.toString());
    router.replace(`/products?${decodeURIComponent(params.toString())}`);
  };

  const fetchFilteredProducts = async () => {
    setIsProductLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("priceRange", priceRange.join(","));
      if (selectedCategories.length > 0) {
        query.set("categories", selectedCategories.join(","));
      }
      if (selectedSizes?.length > 0) {
        query.set("sizes", selectedSizes.join(","));
      }
      query.set("page", page.toString());
      query.set("limit", "12");
      const res = await axiosInstance.get(
        `api/get-filtered-products?${query.toString()}`
      );
      setProducts(res?.data?.products);
      setTotalPages(res?.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Failed to fetch filtered products:", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    updateURL();
    fetchFilteredProducts();
  }, [priceRange, selectedCategories, selectedSizes, page]);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("api/get-categories");
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="w-full bg-[#f5f5f5] pb-10 pt-20">
      <div className="w-[90%] lg:w-[80%] m-auto">
        <div className="pb-[50px] ">
          <h1 className="md:pt-10 font-medium text-4xl leading-[4px] mb-4 font-jost">
            All Products
          </h1>
          <Link href={"/"} className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full" />
          <span className="text-[#55585b]">All Products</span>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <aside className="w-full h-fit lg:w-[270px] !rounded bg-white p-4 space-y-6 shadow">
            {/* price filter */}
            <h3 className="text-xl font-Poppins font-medium">Price Filter</h3>
            <div className="ml-2">
              <Range
                label="Select your value"
                step={STEP}
                min={MIN}
                max={MAX}
                values={tempPriceRange}
                onChange={(values) => setTempPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "6px",
                      width: "100%",
                      background: getTrackBackground({
                        values: tempPriceRange,
                        colors: ["#bfdbfe", "#3b82f6", "#bfdbfe"],
                        min: MIN,
                        max: MAX,
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    key={props.key}
                    style={{
                      ...props.style,
                      height: "16px",
                      width: "16px",
                      backgroundColor: "#3b82f6",
                      borderRadius: "100%",
                    }}
                  />
                )}
              />
              {/* apply */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  ${tempPriceRange[0]} - ${tempPriceRange[1]}
                </div>
                <button
                  onClick={() => {
                    setPriceRange(tempPriceRange);
                    setPage(1);
                  }}
                  className="text-sm px-4 py-1 bg-gray-200 hover:bg-blue-600 hover:text-white"
                >
                  Apply
                </button>
              </div>
            </div>
            {/* category filetr */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-state-300 pb-1">
              Categories
            </h3>
            <ul className="space-y-2 my-3">
              {isLoading ? (
                <p>Loading ...</p>
              ) : (
                data?.categories?.map((category: string) => (
                  <li
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="accent-blue-600"
                      />
                      {category}
                    </label>
                  </li>
                ))
              )}
            </ul>
            {/* Size filter */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-gray-300 pb-1 mt-6">
              Filter by Size
            </h3>
            <ul className="space-y-2 mt-3">
              {sizes.map((size) => (
                <li key={size} className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="accent-blue-600"
                    />
                    <span className="font-medium">{size}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>
          <div className="flex-1 px-2 lg:px-3">
            {isProductLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {products?.map((product: Product) => {
                  const now = new Date();
                  const start = product.starting_date
                    ? new Date(product.starting_date)
                    : null;
                  const end = product.ending_date
                    ? new Date(product.ending_date)
                    : null;

                  const isEvent = start && end && now >= start && now <= end;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isEvent={isEvent!}
                    />
                  );
                })}
              </div>
            ) : (
              <p>No Products found!</p>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 !rounded border border-gray-200 text-sm ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
