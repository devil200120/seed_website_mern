import { Routes, Route } from "react-router-dom";
import "./App.css";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollAnimations from "./components/ScrollAnimations";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorProtectedRoute from "./components/VendorProtectedRoute";

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
import LoginPage from "./pages/LoginPage";
import AdminSignup from "./pages/AdminSignup";
import AdminPanel from "./pages/AdminPanel";
import VendorLogin from "./pages/VendorLogin";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import CustomerRegister from "./pages/CustomerRegister";
import VendorRegister from "./pages/VendorRegister";

function App() {
  return (
    <>
      <Routes>
        {/* Admin Routes - No Header/Footer */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Admin Auth Routes - No Header/Footer */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Vendor Routes - No Header/Footer */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorLogin />} />
        <Route
          path="/vendor/dashboard"
          element={
            <VendorProtectedRoute>
              <VendorDashboardPage />
            </VendorProtectedRoute>
          }
        />

        {/* Legacy route redirect */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Public Routes - With Header/Footer */}
        <Route
          path="/*"
          element={
            <>
              <ScrollAnimations />
              <Header />

              <Routes>
                <Route path="/" element={<Home />} />

                {/* About Us Routes */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/about/our-story" element={<OurStory />} />
                <Route
                  path="/about/mission-vision"
                  element={<MissionVision />}
                />
                <Route path="/about/our-team" element={<OurTeam />} />

                {/* Services Routes */}
                <Route path="/services" element={<Services />} />
                <Route
                  path="/services/product-sourcing"
                  element={<ProductSourcing />}
                />
                <Route
                  path="/services/quality-control"
                  element={<QualityControl />}
                />

                {/* Products Routes */}
                <Route path="/products" element={<Products />} />
                <Route
                  path="/products/fresh-vegetables"
                  element={<FreshVegetables />}
                />
                <Route
                  path="/products/fresh-fruits"
                  element={<FreshFruits />}
                />
                <Route
                  path="/products/spices-herbs"
                  element={<SpicesHerbs />}
                />

                {/* Gallery Routes */}
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/products" element={<ProductGallery />} />

                {/* Other Routes */}
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/contact" element={<Contact />} />

                {/* Customer Routes */}
                <Route path="/customer-register" element={<CustomerRegister />} />
                
                {/* Vendor Routes */}
                <Route path="/vendor-register" element={<VendorRegister />} />
              </Routes>

              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
