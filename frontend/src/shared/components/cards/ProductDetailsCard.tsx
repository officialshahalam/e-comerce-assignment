import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Ratings from "../ratings/Ratings";
import { Heart, MapPin, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "apps/user-ui/src/store";
import useUser from "apps/user-ui/src/hooks/useUser";
import useLocationTracking from "apps/user-ui/src/hooks/useLocationTracking";
import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import { getAxiosInstance } from "packages/utills/axios/getAxios";
import { isProtected } from "packages/utills/protected";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "");
  const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = useStore((state: any) => state.addToCart);
  const cart = useStore((state: any) => state.cart);
  const isInCart = cart.some((item: any) => item.id === data.id);
  const addToWishlist = useStore((state: any) => state.addToWishlist);
  const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
  const wishlist = useStore((state: any) => state.wishlist);
  const isWishlisted = wishlist.some((item: any) => item.id === data.id);
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const handleChat = async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const res = await getAxiosInstance("chatting").post(
        "/create-user-conversation-group",
        { sellerId: data?.shop?.sellerId },
        isProtected
      );
      router.push(`/inbox?conversationId=${res?.data?.conversation?.id}`);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#2d2b2b9c] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.id}
              height={400}
              width={400}
              className="w-full rounded-lg object-contain"
            />
            <div className="gap-2 flex mt-4">
              {data?.images?.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 pt-1"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    height={80}
                    width={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            <div className="border-b relative pb-3 border-gray-200 flex items-center justify-between">
              <div className="flex items-start gap-3">
                {/* Shop Logo */}
                <Image
                  src={
                    data?.Shop?.avatar ||
                    "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740"
                  }
                  alt="Shop Logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[6opx] h-[6opx] object-cover"
                />
                <div>
                  <Link
                    href={`/shop/${data.shop?.id}`}
                    className="text-lg font-medium"
                  >
                    {data?.shop?.name}
                  </Link>
                  <span className="block mt-1">
                    <Ratings rating={data?.shop?.ratings} />
                  </span>
                  <p className="flex gap-2">
                    <MapPin size={20} />{" "}
                    {data?.shop?.address || "Locatiion Not Available"}
                  </p>
                </div>
              </div>
              <button
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                onClick={() => handleChat()}
              >
                💬 Chat with Seller
              </button>
              <button className="w-full absolute cursor-pointer right-[-5px] top-[-5px] flex justify-end my-2 mt-[-10px]">
                <X size={25} onClick={() => setOpen(false)} />
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-3">{data?.title}</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full">
              {data?.short_description}
            </p>
            {data?.brand && (
              <p className="mt-2">
                <strong>Brand:</strong>
                {data?.brand}
              </p>
            )}
            {/* Color & Size Selection */}
            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
              {/* Color Options */}
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${
                          isSelected == color
                            ? "border-gray-400 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        onClick={() => setIsSelected(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Size:</strong>
                  <div className="flex gap-2 mt-1">
                    {data.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        className={`px-4 py-1 cursor-pointer rounded-md transition ${
                          isSizeSelected == size
                            ? "bg-gray-800 text-white"
                            : "bg-gray-300 text-black"
                        }`}
                        onClick={() => setIsSizeSelected(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                ${data?.sale_price}
              </h3>
              {data?.regular_price && (
                <h3 className="text-lg text-red-600 line-through">
                  ${data.regular_price}
                </h3>
              )}
            </div>
            <div className="mt-5 flex items-center gap-5">
              <div className="flex items-center rounded-md">
                <button
                  className="px-3 cursor-pointer py-1 bg-gray-300"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 bg-gray-100 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 cursor-pointer bg-gray-300"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button
                disabled={isInCart}
                onClick={() => {
                  addToCart(
                    {
                      ...data,
                      quantity,
                      selectedOptions: {
                        color: isSelected,
                        size: isSizeSelected,
                      },
                    },
                    user,
                    location,
                    deviceInfo
                  );
                }}
                className={`flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition-all ${
                  isInCart ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <ShoppingCart size={18} />
                Add to cart
              </button>
              <button className="opacity-70 cursor-pointer">
                <Heart
                  size={30}
                  fill={isWishlisted ? "red" : "transparent"}
                  color={isWishlisted ? "transparent" : "black"}
                  onClick={() =>
                    isWishlisted
                      ? removeFromWishlist(data.id, user, location, deviceInfo)
                      : addToWishlist(
                          { ...data, quantity: 1 },
                          user,
                          location,
                          deviceInfo
                        )
                  }
                />
              </button>
            </div>
            <div className="mt-3">
              {data?.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of stock</span>
              )}
            </div>{" "}
            <div className="mt-3 text-gray-600 text-sm">
              Estimated Delivery:{" "}
              <strong>{estimatedDelivery.toDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
