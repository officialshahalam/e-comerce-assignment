"use client";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/types";

import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";

const Page = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [couponCode, setCouponCode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const subTotal = cart.reduce(
    (total, item) => total + item.quantity * item.sale_price,
    0
  );

  const decreaseQuantity = (id: string) => {
    useCartStore.setState((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && (item.quantity ?? 1) > 1
          ? { ...item, quantity: (item.quantity ?? 1) - 1 }
          : item
      ),
    }));
  };
  const increaseQuantity = (id: string) => {
    useCartStore.setState((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && (item.quantity ?? 1) < 10
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item
      ),
    }));
  };

  return (
    <div className="w-full bg-white pt-20">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        {/* Breadcrumb */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-4 font-jost">
            Shopping Cart
          </h1>
          <Link href={"/"} className="text-[#55585b] hover:underline]">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full"></span>
          <span className="text-[#55585b]">Cart</span>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col gap-4 text-center text-gray-600 text-lg">
            Your Cart is empty! start adding product
            <Link
              href={"/products"}
              className="w-full flex items-center justify-center "
            >
              <div className="px-8 cursor-pointer py-2  bg-[#010f1c] text-white hover:bg-[#0989ff] duration-200 transition-all rounded-lg">
                Shop Now
              </div>
            </Link>
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full lg:w-[70%] border-collapse">
              <thead className="bg-[#f1f3f4] rounded">
                <tr>
                  <th className="py-3 text-left pl-4">Product</th>
                  <th className="py-3 text-left">Price</th>
                  <th className="py-3 text-left">Quantity</th>
                  <th className="py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((item: Product) => (
                  <tr key={item?.id} className="border-b border-b-[#0000000e]">
                    <td className="flex items-center gap-3 p-4">
                      <Image
                        src={item?.images[0]?.url}
                        alt={item?.title}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {item?.selectedOptions && (
                          <div className="text-sm text-gray-500 flex gap-2">
                            {item?.selectedOptions.color && (
                              <div className="flex items-center justify-center gap-1">
                                Color:
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions?.color,
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "100%",
                                    display: "inline-block",
                                  }}
                                />
                              </div>
                            )}
                            {item?.selectedOptions?.size && (
                              <span className="ml-2">
                                Size: {item?.selectedOptions?.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="text-lg">
                      <span>${item.sale_price.toFixed(2)}</span>
                    </td>

                    <td>
                      <div className="flex justify-center items-center border border-gray-200 rounded-[20px] w-[90px] p-[2px]">
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="px-4">{item?.quantity}</span>
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="text-center">
                      <button
                        className="text-[#818487] hover:text-[#ff1826] cursor-pointer transition-all duration-200"
                        onClick={() => removeFromCart(item?.id)}
                      >
                        ⛌ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-6 shadow-md w-full lg:w-[30%] bg-[#f9f9f9] rounded-lg">
              <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3">
                <span>Subtotal</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="mb-4">
                <h4 className="mb-2 font-[500] text-base">Have a coupon?</h4>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setCouponCode(e.target.value);
                    }}
                    placeholder="Enter Coupon code"
                    className="w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500"
                  />
                  <button
                    className="bg-blue-500 cursor-pointer text-white px-4 rounded-r-md hover:bg-blue-600 transition-all"
                    onClick={() => {}}
                  >
                    Apply
                  </button>
                </div>
                <hr className="my-4 text-slate-200" />
                <div className="mb-4">
                  <h4 className="mb-2 text-base font-medium">
                    Select Shipping Address
                  </h4>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500"
                    value={selectedAddress}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
                      setSelectedAddress(e.target.value);
                    }}
                  >
                    <option value={"Home"}>Home - Sardhana Meerut</option>
                    <option value={"College"}>College - AKGEC Ghaziabad</option>
                    <option value={"Office"}>Office - Noida sector-63</option>
                  </select>
                </div>

                <hr className="my-4 text-slate-200" />
                <div className="mb-4">
                  <h4 className="mb-2 text-base font-medium">
                    Select Payment Method
                  </h4>
                  <select className="w-full p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500">
                    <option value="credit_card">Online Payment</option>
                    <option value="cash_on_delivery">Cash On Delivery</option>
                  </select>
                </div>

                <hr className="my-4 text-slate-200" />
                <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3">
                  <span className="font-jost">Total</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 cursor-pointer mt-4 py-3 bg-[#010f1c] text-white hover:bg-[#0989ff] duration-200 transition-all rounded-lg">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
