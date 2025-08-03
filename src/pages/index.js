import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@heroui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <Button color="primary">Click Me</Button>
    </div>
  );
}
