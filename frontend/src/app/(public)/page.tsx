"use client";
import React from "react";

import { useQuery } from "@tanstack/react-query";

import Hero from "@/shared/components/Hero";
import SectionTitle from "@/shared/components/SectionTitle";
import ProductCard from "@/shared/components/cards/ProductCard";
import axiosInstance from "@/utils/axiosInstance";

const Home = () => {
  const { data: products, isLoading: productLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/get-all-products?page=1&limit=13&type=latest"
      );
      return res.data?.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="bg-[#f5f5f5] mt-12">
      <Hero />
      <div className="md:w-[80%] w-[90%] py-14 m-auto">
        {/* *************************Suggested Products********************** */}
        <div className="mb-8">
          <SectionTitle title="Latest Products" />
        </div>
        {productLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <p className="text-center">No Products Available Yet!</p>
        ) : (
          <div className="m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {products?.map((product: any) => {
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
        )}
      </div>
    </div>
  );
};

export default Home;
