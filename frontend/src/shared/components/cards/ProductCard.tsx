import Link from "next/link";
import React from "react";

import { Eye, Heart, ShoppingBag } from "lucide-react";

import Ratings from "../Ratings";
import { useCartStore } from "@/stores/cartStore";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  const cart = useCartStore((state: any) => state.cart);
  const addToCart = useCartStore((state: any) => state.addToCart);
  const isInCart = cart.some((item: any) => item.id === product.id);

  return (
    <div className="w-full min-h-[350px] pb-8 h-max bg-white rounded-lg relative">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md uppercase animate-bounce">
          Offer
        </div>
      )}
      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          Limited Stock
        </div>
      )}
      <Link href={`/products/${product?.id}`}>
        <img
          src={product?.images[0]?.url || ""}
          alt={product.title}
          width={300}
          height={300}
          className="w-full  h-[200px] object-cover mx-auto rounded-t-md"
        />
      </Link>
      <Link
        href={`/shop/${product?.shop?.id}`}
        className="block text-blue-500 text-sm font-medium my-2 px-2"
      >
        {product?.shop?.name}
      </Link>
      <Link href={`/shop/${product?.slug}`}>
        <h1 className="text-base font-semibold px-2 text-gray-800 w-48 truncate">
          {product?.title}
        </h1>
      </Link>
      <div className="mt-2 px-2">
        <Ratings rating={product?.ratings} />
      </div>
      <div className="mt-3 flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product?.sale_price}
          </span>
          <span className="text-sm line-through text-gray-400">
            ${product?.regular_price}
          </span>
        </div>
        <span className="text-green-500 text-sm font-medium">
          {product?.totalSales || 37} sold
        </span>
      </div>

      <div className="absolute z-10 flex flex-col gap-3 right-3 top-2">
        <div className="bg-gray-300 rounded-full p-[16px] shadow-md">
          <ShoppingBag
            className="cursor-pointer text-[#4b5563] hover:scale-110 transition"
            size={22}
            onClick={() => !isInCart && addToCart({ ...product, quantity: 1 })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
