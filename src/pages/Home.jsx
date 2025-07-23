import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Products from "../components/Products";
import Gallery from "../components/Gallery";
import Certifications from "../components/Certifications";
import Contact from "../components/Contact";
import ProductSelection from "../components/ProductSelection";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Products />
      <ProductSelection />

      <Gallery />
      <Certifications />
      <Contact />
    </>
  );
}

export default Home;
