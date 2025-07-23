import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Handle scroll effect for navigation visibility
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrolled = () => {
      const scrollY = window.scrollY;
      
      if (isHomePage) {
        // On home page: hide nav initially, show when scrolling down
        if (scrollY > 100) {
          setIsScrolled(true);
          // Show nav when scrolling down, hide when scrolling up fast
          if (scrollY > lastScrollY && scrollY > 200) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        } else {
          setIsScrolled(false);
          setIsVisible(false); // Hide when at top of home page
        }
      } else {
        // On other pages: always show nav
        setIsScrolled(scrollY > 100);
        setIsVisible(true);
      }
      
      lastScrollY = scrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    };

    const onScroll = () => requestTick();

    // Set initial state
    if (isHomePage) {
      setIsVisible(window.scrollY > 100);
      setIsScrolled(window.scrollY > 100);
    } else {
      setIsVisible(true);
      setIsScrolled(window.scrollY > 100);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".nav") &&
        !event.target.closest(".hamburger")
      ) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown, event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 768;

  return (
    <>
      <header 
        className={`header ${isScrolled ? 'header-scrolled' : ''} ${isVisible ? 'header-visible' : 'header-hidden'} ${isHomePage ? 'header-home' : ''}`}
      >
        <div className="container">
          <div className="logo">
            <div className="logo-img">F</div>
            <Link to="/" className="logo-text" onClick={closeMenu}>
              Field to Feed Export
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>

              <li className={`dropdown ${activeDropdown === "about" ? "active" : ""}`}>
                <div
                  className="dropdown-trigger"
                  onClick={(e) => {
                    if (isMobile()) {
                      toggleDropdown("about", e);
                    } else {
                      window.location.href = "/about";
                    }
                  }}
                >
                  About Us
                  <span className="dropdown-arrow">▼</span>
                </div>
                <div className="dropdown-content">
                  <Link to="/about" onClick={closeMenu}>
                    Our Story
                  </Link>
                  <Link to="/about/mission-vision" onClick={closeMenu}>
                    Mission & Vision
                  </Link>
                  <Link to="/about/our-team" onClick={closeMenu}>
                    Our Team
                  </Link>
                  <Link to="/about" onClick={closeMenu}>
                    Company Profile
                  </Link>
                </div>
              </li>

              <li className={`dropdown ${activeDropdown === "services" ? "active" : ""}`}>
                <div
                  className="dropdown-trigger"
                  onClick={(e) => {
                    if (isMobile()) {
                      toggleDropdown("services", e);
                    } else {
                      window.location.href = "/services";
                    }
                  }}
                >
                  Services
                  <span className="dropdown-arrow">▼</span>
                </div>
                <div className="dropdown-content">
                  <Link to="/services/product-sourcing" onClick={closeMenu}>
                    Product Sourcing
                  </Link>
                  <Link to="/services/quality-control" onClick={closeMenu}>
                    Quality Control
                  </Link>
                  <Link to="/services" onClick={closeMenu}>
                    Export Documentation
                  </Link>
                  <Link to="/services" onClick={closeMenu}>
                    Logistics & Shipping
                  </Link>
                </div>
              </li>

              <li className={`dropdown ${activeDropdown === "products" ? "active" : ""}`}>
                <div
                  className="dropdown-trigger"
                  onClick={(e) => {
                    if (isMobile()) {
                      toggleDropdown("products", e);
                    } else {
                      window.location.href = "/products";
                    }
                  }}
                >
                  Products
                  <span className="dropdown-arrow">▼</span>
                </div>
                <div className="dropdown-content">
                  <Link to="/products/fresh-vegetables" onClick={closeMenu}>
                    Fresh Vegetables
                  </Link>
                  <Link to="/products/fresh-fruits" onClick={closeMenu}>
                    Fresh Fruits
                  </Link>
                  <Link to="/products/spices-herbs" onClick={closeMenu}>
                    Spices & Herbs
                  </Link>
                  <Link to="/products" onClick={closeMenu}>
                    Grains & Cereals
                  </Link>
                </div>
              </li>

              <li>
                <Link to="/gallery" onClick={closeMenu}>
                  Gallery
                </Link>
              </li>

              <li className={`dropdown ${activeDropdown === "quality" ? "active" : ""}`}>
                <div
                  className="dropdown-trigger"
                  onClick={(e) => {
                    if (isMobile()) {
                      toggleDropdown("quality", e);
                    } else {
                      window.location.href = "/certifications";
                    }
                  }}
                >
                  Quality
                  <span className="dropdown-arrow">▼</span>
                </div>
                <div className="dropdown-content">
                  <Link to="/certifications" onClick={closeMenu}>
                    Certifications
                  </Link>
                  <Link to="/certifications" onClick={closeMenu}>
                    Quality Standards
                  </Link>
                  <Link to="/certifications" onClick={closeMenu}>
                    Food Safety
                  </Link>
                </div>
              </li>

              <li>
                <Link to="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <div className="contact-info">
              <span>📞 +91 98765 43210</span>
              <span>✉️ info@fieldtofeedexport.com</span>
            </div>
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </>
  );
}

export default Header;