import NavbarLayout from "@/components/ui/Navbar/Navbar";
import EditorPage from "@/components/views/EditorPage/EditorPage";

const { default: LayoutApp } = require("@/components/layouts");

const AboutPage = () => {
  return (
    <LayoutApp title="Editor">
      <NavbarLayout />
      <EditorPage />
    </LayoutApp>
  );
};
export default AboutPage;
