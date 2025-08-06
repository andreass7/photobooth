import NavbarLayout from "@/components/ui/Navbar/Navbar";

const { default: LayoutApp } = require("@/components/layouts");
const { default: About } = require("@/components/views/About");

const AboutPage = () => {
  return (
    <LayoutApp title="About">
      <NavbarLayout />
      <About />
    </LayoutApp>
  );
};
export default AboutPage;
