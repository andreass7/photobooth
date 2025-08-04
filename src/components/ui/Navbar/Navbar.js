import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { motion } from "framer-motion";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const NavbarLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <Navbar
      className="shadow-lg mx-auto rounded-xl sm:w-1/4 sm:top-5"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex mx-auto items-center"
        justify="center"
      >
        <div className="absolute inset-0 flex justify-center space-x-4">
          {menuItems.map((item, index) =>
            currentPath === item.href ? (
              <motion.div
                key={item.href}
                layoutId="active-pill"
                className="w-full max-w-[80px] h-12 flex items-center justify-center my-auto bg-green-300 rounded-lg z-0"
                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              />
            ) : (
              <div key={index} className="w-full max-w-[80px]" />
            )
          )}
        </div>
        {menuItems.map((item, index) => (
          <NavbarItem key={index} className="z-10">
            <Link
              href={item.href}
              className={`rounded-xl font-semibold text-sm px-5 py-2 transition-colors duration-300 ${
                currentPath === item.href
                  ? "text-gray-800"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={item.href}
              className={`block w-full text-base px-3 py-2 rounded-xl ${
                currentPath === item.href
                  ? "bg-green-300 text-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarLayout;
