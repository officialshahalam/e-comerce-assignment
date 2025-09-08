"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, LogOut } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { navItem } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

const Navbar = () => {
  const { cart } = useCartStore();
  const { user } = useUserStore();
  const { clearUser } = useUserStore();
  const router = useRouter();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout-user");
      clearUser();
      setShowUserMenu(false); // Close menu before redirect
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest(".user-dropdown")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div>
      <nav className="bg-white shadow-lg fixed top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href={"/"} className="text-2xl font-bold text-gray-800">
                Brand
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="flex justify-center items-center gap-5">
              {navItem.map(({ href, Icon, label }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50 relative"
              >
                <div className="relative">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                </div>
                <span className="font-medium">Cart</span>
              </Link>

              {/* Auth Section */}
              {!user ? (
                // If no user → show Login / Signup
                <div className="flex items-center space-x-3">
                  <Link
                    href={"/login"}
                    className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                // If user logged in → show dropdown
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    <Image
                      src={
                        "https://ik.imagekit.io/aalam855/MyMedia/seller-avatar.avif?updatedAt=1757217987681"
                      }
                      width={32}
                      height={32}
                      alt={user?.name || "Guest"}
                      className="rounded-full"
                    />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.name ?? "Guest"}
                      </span>
                      <span className="text-xs text-gray-500">ansari</span>
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
