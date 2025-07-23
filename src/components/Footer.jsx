function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Field to Feed Export</h3>
            <p>
              Your trusted partner in premium agricultural exports. Connecting
              Indian farms to global markets with quality, trust and excellence.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                📘
              </a>
              <a href="#" aria-label="Twitter">
                🐦
              </a>
              <a href="#" aria-label="LinkedIn">
                💼
              </a>
              <a href="#" aria-label="Instagram">
                📷
              </a>
              <a href="#" aria-label="WhatsApp">
                💬
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#products">Products</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Products</h4>
            <ul>
              <li>
                <a href="#">Fresh Vegetables</a>
              </li>
              <li>
                <a href="#">Fresh Fruits</a>
              </li>
              <li>
                <a href="#">Spices & Herbs</a>
              </li>
              <li>
                <a href="#">Grains & Cereals</a>
              </li>
              <li>
                <a href="#">Pulses & Legumes</a>
              </li>
              <li>
                <a href="#">Oil Seeds</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact">
              <p>
                📍 123 Export Plaza, Agricultural District
                <br />
                Mumbai, Maharashtra 400001, India
              </p>
              <p>📞 +1 4319906055 </p>
              <p>✉️ info@fieldtofeedexport.com</p>
              <p>🌐 www.fieldtofeedexport.com</p>
            </div>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>
              Subscribe to get latest updates on products and market trends.
            </p>
            <div className="newsletter">
              <input type="email" placeholder="Your email address" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Field to Feed Export. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
