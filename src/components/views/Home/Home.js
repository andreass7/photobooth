import { Button } from "@heroui/react";
import { useRouter } from "next/router";
import { FaCameraRetro } from "react-icons/fa";
import { motion } from "framer-motion";

const HomeApp = () => {
  const router = useRouter();
  const handleStart = () => {
    router.push("/layout");
  };

  return (
    <div>
      <section className="text-center mt-30 px-4 lg:px-0">
        <motion.h1
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="lg:text-7xl text-6xl font-bold text-gray-600"
        >
          BERGAYA<span className="text-green-400"> & CISSS 📸</span>
        </motion.h1>
        <p className="text-xl w-1/2 flex mx-auto text-gray-600 mt-3">
          Abadikan momenmu dengan sekali klik. Photobooth modern, praktis, dan
          penuh gaya!
        </p>
        <Button
          onPress={handleStart}
          className="bg-green-400 lg:mt-20 mt-10 hover:bg-green-300 border border-gray-200 w-32 h-12"
        >
          <FaCameraRetro className="text-gray-600" />
          Mulai
        </Button>
      </section>
    </div>
  );
};

export default HomeApp;
