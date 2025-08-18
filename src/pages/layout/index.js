import LayoutApp from "@/components/layouts";
import NavbarLayout from "@/components/ui/Navbar/Navbar";
import Layout from "@/components/views/Layout";

const layoutGridPage = () => {
  return (
    <LayoutApp title="Layout">
      <NavbarLayout />
      <Layout />
    </LayoutApp>
  );
};
export default layoutGridPage;
