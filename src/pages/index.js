import LayoutApp from "@/components/layouts";
import HomeApp from "@/components/views/Home";
import NavbarLayout from "@/components/ui/Navbar/Navbar";

export default function Home() {
  return (
    <LayoutApp title="Home">
      {/* <div>Halo</div> */}
      <NavbarLayout />

      <HomeApp />
    </LayoutApp>
  );
}
