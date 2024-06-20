import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

interface NavLink {
  url: string;
  icon: JSX.Element;
  label: string;
}

export const navLinks: NavLink[] = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "Collections",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Products",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Orders",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Customers",
  },
];