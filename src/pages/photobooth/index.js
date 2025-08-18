import LayoutApp from "@/components/layouts";
import NavbarLayout from "@/components/ui/Navbar/Navbar";
import Photobooth from "@/components/views/Photobooth/Photobooth";

const layoutGridPage = () => {
  return (
    <LayoutApp title="Layout">
      <NavbarLayout />
      <Photobooth />
    </LayoutApp>
  );
};
export default layoutGridPage;
