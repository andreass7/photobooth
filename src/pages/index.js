import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@heroui/react";
import PageHead from "@/components/common";
import LayoutApp from "@/components/layouts";
import About from "@/components/views/About";
import HomeApp from "@/components/views/Home";
import NavbarLayout from "@/components/ui/Navbar/Navbar";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <LayoutApp title="Home">
      {/* <div>Halo</div> */}
      <NavbarLayout />

      <HomeApp />
    </LayoutApp>
  );
}
