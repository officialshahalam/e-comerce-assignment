import { Package, Settings, Tag, User } from "lucide-react";

export const navItem = [
  {
    label: "Products",
    Icon: Package,
    href: "/products",
  },
  {
    label: "Offers",
    Icon: Tag,
    href: "/offers",
  },
];

export const userMenu = [
  {
    label: "Profile",
    Icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    Icon: Settings,
    href: "/dashboard/settings",
  },
];
