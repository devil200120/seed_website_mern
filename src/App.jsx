import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollAnimations from "./components/ScrollAnimations";

// Import pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import OurStory from "./pages/OurStory";
import MissionVision from "./pages/MissionVision";
import OurTeam from "./pages/OurTeam";
import Services from "./pages/Services";
import ProductSourcing from "./pages/ProductSourcing";
import QualityControl from "./pages/QualityControl";
import Products from "./pages/Products";
import FreshVegetables from "./pages/FreshVegetables";
import FreshFruits from "./pages/FreshFruits";
import SpicesHerbs from "./pages/SpicesHerbs";
import Gallery from "./pages/Gallery";
import ProductGallery from "./pages/ProductGallery";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <ScrollAnimations />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* About Us Routes */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about/our-story" element={<OurStory />} />
        <Route path="/about/mission-vision" element={<MissionVision />} />
        <Route path="/about/our-team" element={<OurTeam />} />

        {/* Services Routes */}
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/product-sourcing"
          element={<ProductSourcing />}
        />
        <Route path="/services/quality-control" element={<QualityControl />} />

        {/* Products Routes */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/fresh-vegetables" element={<FreshVegetables />} />
        <Route path="/products/fresh-fruits" element={<FreshFruits />} />
        <Route path="/products/spices-herbs" element={<SpicesHerbs />} />

        {/* Gallery Routes */}
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/products" element={<ProductGallery />} />

        {/* Other Routes */}
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
      
    </>
  );
}

export default App;