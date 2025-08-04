import NavbarLayout from "@/components/ui/Navbar/Navbar";
import { Button } from "@heroui/react";

const HomeApp = () => {
  return (
    <div>
      <section className="text-center mt-20">
        <h1 className="text-4xl font-bold">GAYA MODERN DAN SIMPLE</h1>
        <p className="text-lg mt-2">Abadikan Momenmu Dengan Sekali Klik</p>
        <Button className="bg-green-300 mt-4">Mulai</Button>
      </section>
      {/* kotak placeholder di bawah */}
      <div className="flex justify-center gap-4 mt-10">
        <div className="w-32 h-48 border rounded" />
        <div className="w-32 h-64 border rounded" />
        <div className="w-32 h-48 border rounded" />
      </div>
    </div>
  );
};

export default HomeApp;
