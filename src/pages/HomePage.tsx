import Content from "@/components/Landing/Content";
import Footer from "@/components/Landing/Footer";
import Navbar from "@/components/Landing/Navbar";

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
