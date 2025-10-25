import Navbar from "@/components/Landing/Navbar";
import Content from "@/components/Landing/Content";
import Footer from "@/components/Landing/Footer";

function HomePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
      <Content />
      <Footer />
    </div>
  );
}

export default HomePage;
