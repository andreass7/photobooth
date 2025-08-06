import NavbarLayout from "@/components/ui/Navbar/Navbar";
import { Button } from "@heroui/react";
import { FaCameraRetro } from "react-icons/fa";

const HomeApp = () => {
  return (
    <div>
      <section className="text-center mt-30 px-4 lg:px-0">
        <h1 className="lg:text-7xl text-6xl font-bold text-gray-600">
          GAYA MODERN DAN SIMPLE
        </h1>
        <p className="text-xl text-gray-600 mt-3">
          Abadikan Momenmu Dengan Sekali Klik
        </p>
        <Button className="bg-green-300 lg:mt-20 mt-10 hover:bg-green-200 border border-gray-200 w-32 h-12">
          <FaCameraRetro className="text-gray-600" />
          Mulai
        </Button>
      </section>
    </div>
  );
};

export default HomeApp;
