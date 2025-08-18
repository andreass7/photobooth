import {
  Navbar,
  NavbarBrand,
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

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const NavbarLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <Navbar
      className="lg:shadow-lg border shadow-sm mx-auto rounded-xl sm:w-1/6 sm:top-5"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">PHOTOBOOTH</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex mx-auto items-center"
        justify="center"
      >
        <div className="absolute inset-0 flex justify-center space-x-3">
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
              className={`rounded-xl font-semibold text-sm px-4 py-2 transition-colors duration-300 ${
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
