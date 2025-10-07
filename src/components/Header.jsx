import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Handle scroll effect for navigation visibility
  // useEffect(() => {
  //   let lastScrollY = window.scrollY;
  //   let ticking = false;

  //   const updateScrolled = () => {
  //     const scrollY = window.scrollY;
      
  //     if (isHomePage) {
  //       // On home page: hide nav initially, show when scrolling down
  //       if (scrollY > 100) {
  //         setIsScrolled(true);
  //         // Show nav when scrolling down, hide when scrolling up fast
  //         if (scrollY > lastScrollY && scrollY > 200) {
  //           setIsVisible(false);
  //         } else {
  //           setIsVisible(true);
  //         }
  //       } else {
  //         setIsScrolled(false);
  //         setIsVisible(false); // Hide when at top of home page
  //       }
  //     } else {
  //       // On other pages: always show nav
  //       setIsScrolled(scrollY > 100);
  //       setIsVisible(true);
  //     }
      
  //     lastScrollY = scrollY;
  //     ticking = false;
  //   };

  //   const requestTick = () => {
  //     if (!ticking) {
  //       requestAnimationFrame(updateScrolled);
  //       ticking = true;
  //     }
  //   };

  //   const onScroll = () => requestTick();

  //   // Set initial state
  //   if (isHomePage) {
  //     setIsVisible(window.scrollY > 100);
  //     setIsScrolled(window.scrollY > 100);
  //   } else {
  //     setIsVisible(true);
  //     setIsScrolled(window.scrollY > 100);
  //   }

  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [isHomePage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".nav") &&
        !event.target.closest(".hamburger")
      ) {
        setIsMenuOpen(false);
      }
      if (
        isRegisterOpen &&
        !event.target.closest(".register-dropdown")
      ) {
        setIsRegisterOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, isRegisterOpen]);

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
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleRegister = () => {
    setIsRegisterOpen(!isRegisterOpen);
  };

  return (
    <>
      <header 
        className={`header ${isScrolled ? 'header-scrolled' : ''} ${isVisible ? 'header-visible' : 'header-hidden'} ${isHomePage ? 'header-home' : ''}`}
      >
        <div className="container header-container">
          <div className="logo">
            <div className="logo-img">F</div>
            <Link to="/" className="logo-text" onClick={closeMenu}>
              Field to Feed Export
            </Link>
          </div>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <button className="nav-close" onClick={closeMenu} aria-label="Close menu">
              ✕
            </button>
            <ul>
              <li>
                <Link to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" onClick={closeMenu}>
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/services" onClick={closeMenu}>
                  Services
                </Link>
              </li>

              <li>
                <Link to="/products" onClick={closeMenu}>
                  Products
                </Link>
              </li>

              <li>
                <Link to="/gallery" onClick={closeMenu}>
                  Gallery
                </Link>
              </li>

              <li>
                <Link to="/certifications" onClick={closeMenu}>
                  Quality
                </Link>
              </li>

              <li>
                <Link to="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </ul>

            {/* Register/Login section inside mobile menu */}
            <div className="nav-register-section">
              <div className="nav-register-divider"></div>
              <div className="nav-register-links">
                <Link to="/customer-register" className="nav-register-link" onClick={closeMenu}>
                  <span className="register-icon">👤</span>
                  Customer Register
                </Link>
                <Link to="/vendor-register" className="nav-register-link" onClick={closeMenu}>
                  <span className="register-icon">🏪</span>
                  Vendor Register
                </Link>
              </div>
            </div>
          </nav>

          <div className="header-right">
            <div className="contact-info">
              <span>📞 +91 98765 43210</span>
              <span>✉️ info@fieldtofeedexport.com</span>
            </div>
            <div className={`register-dropdown ${isRegisterOpen ? "active" : ""}`}>
              <button
                className="register-btn"
                onClick={toggleRegister}
                aria-label="Register or Login"
              >
                Register/Login
              </button>
              {isRegisterOpen && (
                <div className="register-dropdown-content">
                  <Link to="/customer-register" className="register-option" onClick={() => setIsRegisterOpen(false)}>
                    Customer Register
                  </Link>
                  <Link to="/vendor-register" className="register-option" onClick={() => setIsRegisterOpen(false)}>
                    Vendor Register
                  </Link>
                </div>
              )}
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